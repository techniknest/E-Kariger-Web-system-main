import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

 async findAll() {
    return this.prisma.service.findMany({
      where: { is_active: true },
      include: {
        vendor: {
          include: {
            // "city" is already inside 'vendor', so we don't need to ask for it here.
            // We only need to ask for the name from the 'user' relation.
            user: { select: { name: true } } 
          }
        },
        category: true,
      },
    });
  } // 1. Public: Get All Services (For Homepage)
 

  // 2. Protected: Create Service
  async createService(userId: string, data: any) {
    // Check if Vendor Profile exists
    const vendor = await this.prisma.vendorProfile.findUnique({
      where: { user_id: userId },
    });

    if (!vendor) throw new NotFoundException("Vendor profile not found");

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
}