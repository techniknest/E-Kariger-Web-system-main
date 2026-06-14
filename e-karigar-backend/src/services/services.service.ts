import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { VendorVerificationStatus } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    const services = await this.prisma.service.findMany({
      where: { 
        is_active: true,
        vendor: {
          approval_status: 'APPROVED'
        }
      },
      include: {
        vendor: {
          include: {
            user: { select: { name: true } },
            reviews_received: { select: { rating: true } }
          }
        },
        category: true,
      },
    });

    return services.map(service => {
      const reviews = service.vendor.reviews_received;
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0
        ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10
        : 0;

      // Exclude the raw reviews_received array from the payload to save bandwidth
      const { reviews_received, ...vendorWithoutReviews } = service.vendor;

      return {
        ...service,
        vendor: vendorWithoutReviews,
        vendorRating: { averageRating, totalReviews }
      };
    });
  } // 1. Public: Get All Services (For Homepage)

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        vendor: {
          include: {
            user: { select: { name: true, email: true, profile_photo: true } },
            reviews_received: {
              include: {
                client: { select: { name: true } },
              },
              orderBy: { created_at: 'desc' },
            },
          }
        },
        category: true,
      },
    });
    if (!service || service.vendor.approval_status !== 'APPROVED') {
      throw new NotFoundException('Service not found or vendor is not active');
    }

    // Compute aggregate rating for this vendor
    const reviews = service.vendor.reviews_received;
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10
      : 0;

    return {
      ...service,
      vendorRating: { averageRating, totalReviews },
    };
  }


  // 2. Protected: Create Service
  async createService(userId: string, data: any) {
    // Check if Vendor Profile exists
    const vendor = await this.prisma.vendorProfile.findUnique({
      where: { user_id: userId },
    });

    if (!vendor) throw new NotFoundException("Vendor profile not found");

    if (vendor.approval_status !== VendorVerificationStatus.APPROVED) {
      throw new ForbiddenException(`You cannot create services because your account is ${vendor.approval_status.toLowerCase()}`);
    }

    // Handle Category (Default to 'General' if missing)
    let category = await this.prisma.category.findFirst();
    if (!category) {
      category = await this.prisma.category.create({
        data: { name: "General", is_active: true }
      });
    }

    return this.prisma.service.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price, // Ensure frontend sends this as a number or string
        images: data.images || [], // Handle images array
        vendor_id: vendor.id,
        category_id: category.id,
        is_active: true,
      },
    });
  }

  // 3. Protected: Get Vendor's Own Services
  async getMyServices(userId: string) {
    const vendor = await this.prisma.vendorProfile.findUnique({ where: { user_id: userId } });
    if (!vendor) return [];

    return this.prisma.service.findMany({
      where: { vendor_id: vendor.id }
    });
  }

  // 4. Update Service (Owner only)
  async updateService(userId: string, serviceId: string, data: any) {
    const vendor = await this.prisma.vendorProfile.findUnique({ where: { user_id: userId } });
    if (!vendor) throw new NotFoundException("Vendor profile not found");

    const service = await this.prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) throw new NotFoundException("Service not found");
    if (service.vendor_id !== vendor.id) throw new NotFoundException("You do not own this service");

    return this.prisma.service.update({
      where: { id: serviceId },
      data: {
        title: data.title ?? service.title,
        description: data.description ?? service.description,
        price: data.price ?? service.price,
        images: data.images ?? service.images,
        is_active: data.is_active ?? service.is_active,
      }
    });
  }

  // 5. Delete Service (Owner only)
  async deleteService(userId: string, serviceId: string) {
    const vendor = await this.prisma.vendorProfile.findUnique({ where: { user_id: userId } });
    if (!vendor) throw new NotFoundException("Vendor profile not found");

    const service = await this.prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) throw new NotFoundException("Service not found");
    if (service.vendor_id !== vendor.id) throw new NotFoundException("You do not own this service");

    return this.prisma.service.delete({
      where: { id: serviceId }
    });
  }
}