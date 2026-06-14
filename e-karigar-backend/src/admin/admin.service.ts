import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { VendorVerificationStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService, private notificationsService: NotificationsService) { }

  // 1. Get All Pending Vendors (with full details)
  async getPendingVendors() {
    return this.prisma.vendorProfile.findMany({
      where: { approval_status: VendorVerificationStatus.PENDING },
      include: {
        user: {
          select: { name: true, email: true, phone: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  // 2. Approve a Vendor
  async approveVendor(vendorId: string) {
    const vendor = await this.prisma.vendorProfile.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) throw new NotFoundException('Vendor not found');

    const updatedVendor = await this.prisma.vendorProfile.update({
      where: { id: vendorId },
      data: {
        approval_status: VendorVerificationStatus.APPROVED,
        is_verified: true,
      },
    });

    await this.notificationsService.create(
      vendor.user_id,
      'VENDOR_APPROVED',
      'Account Approved',
      'Your vendor account has been verified and approved. You can now receive jobs.',
      '/vendor/dashboard'
    );

    return updatedVendor;
  }

  // 3. Reject a Vendor
  async rejectVendor(vendorId: string) {
    const vendor = await this.prisma.vendorProfile.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) throw new NotFoundException('Vendor not found');

    const updatedVendor = await this.prisma.vendorProfile.update({
      where: { id: vendorId },
      data: {
        approval_status: VendorVerificationStatus.REJECTED,
      },
    });

    await this.notificationsService.create(
      vendor.user_id,
      'VENDOR_REJECTED',
      'Account Rejected',
      'Unfortunately, your vendor account request has been rejected.',
      '/vendor/dashboard'
    );

    return updatedVendor;
  }

  // 4. Get All Approved Vendors (with ratings and completed jobs)
  async getApprovedVendors() {
    const vendors = await this.prisma.vendorProfile.findMany({
      where: { approval_status: VendorVerificationStatus.APPROVED },
      include: {
        user: {
          select: { name: true, email: true, phone: true },
        },
        services: true,
      },
      orderBy: { created_at: 'desc' },
    });

    if (vendors.length === 0) return [];
    
    const vendorIds = vendors.map(v => v.id);

    const [ratings, completedJobs] = await Promise.all([
      this.prisma.review.groupBy({
        by: ['vendor_id'],
        where: { vendor_id: { in: vendorIds } },
        _avg: { rating: true },
        _count: { rating: true }
      }),
      this.prisma.booking.groupBy({
        by: ['vendor_id'],
        where: { vendor_id: { in: vendorIds }, status: 'COMPLETED' },
        _count: { id: true }
      })
    ]);

    const ratingsMap = new Map(ratings.map(r => [r.vendor_id, { avg: r._avg.rating || 0, count: r._count.rating }]));
    const jobsMap = new Map(completedJobs.map(j => [j.vendor_id, j._count.id]));

    return vendors.map(vendor => {
      const ratingInfo = ratingsMap.get(vendor.id) || { avg: 0, count: 0 };
      
      return {
        ...vendor,
        averageRating: Math.round(ratingInfo.avg * 10) / 10,
        totalReviews: ratingInfo.count,
        completedJobsCount: jobsMap.get(vendor.id) || 0
      };
    });
  }


  // 5. Get Dashboard Stats
  async getDashboardStats() {
    // Sequential fetching to avoid connection pool exhaustion (limit=1)
    const pendingVendors = await this.prisma.vendorProfile.count({ where: { approval_status: VendorVerificationStatus.PENDING } });
    const approvedVendors = await this.prisma.vendorProfile.count({ where: { approval_status: VendorVerificationStatus.APPROVED } });
    const suspendedVendors = await this.prisma.vendorProfile.count({ where: { approval_status: VendorVerificationStatus.SUSPENDED } });
    const totalUsers = await this.prisma.user.count();
    const totalServices = await this.prisma.service.count();

    return {
      pendingVendors,
      approvedVendors,
      suspendedVendors,
      totalUsers,
      totalServices,
    };
  }

  // 6. Delete a Vendor
  async deleteVendor(vendorId: string) {
    const vendor = await this.prisma.vendorProfile.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) throw new NotFoundException('Vendor not found');

    await this.prisma.service.deleteMany({
      where: { vendor_id: vendorId },
    });

    return this.prisma.vendorProfile.delete({
      where: { id: vendorId },
    });
  }

  // 7. Delete any Service (Admin)
  async deleteService(serviceId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) throw new NotFoundException('Service not found');

    return this.prisma.service.delete({
      where: { id: serviceId },
    });
  }

  // 8. Get Single Vendor Details
  async getVendorDetails(vendorId: string) {
    const vendor = await this.prisma.vendorProfile.findUnique({
      where: { id: vendorId },
      include: {
        user: {
          select: { name: true, email: true, phone: true }
        }
      }
    });

    if (!vendor) throw new NotFoundException('Vendor not found');

    const [reviewAgg, completedBookings] = await Promise.all([
      this.prisma.review.aggregate({
        where: { vendor_id: vendorId },
        _avg: { rating: true },
        _count: { rating: true }
      }),
      this.prisma.booking.findMany({
        where: { vendor_id: vendorId, status: 'COMPLETED' },
        select: { final_price: true, total_price: true }
      })
    ]);

    const totalReviews = reviewAgg._count.rating || 0;
    const averageRating = Math.round((reviewAgg._avg.rating || 0) * 10) / 10;
    const completedBookingsCount = completedBookings.length;
    
    const totalRevenue = completedBookings.reduce((sum, b) => {
      const price = b.final_price || b.total_price;
      return sum + (price ? Number(price) : 0);
    }, 0);

    return {
      ...vendor,
      averageRating,
      totalReviews,
      completedBookingsCount,
      totalRevenue: Math.round(totalRevenue * 100) / 100
    };
  }

  // 9. Get Vendor Bookings
  async getVendorBookings(vendorId: string) {
    const bookings = await this.prisma.booking.findMany({
      where: { vendor_id: vendorId },
      include: {
        client: { 
          select: { 
            name: true, 
            email: true,
            phone: true
          } 
        },
        service: { 
          select: { 
            title: true, 
            price: true 
          } 
        }
      },
      orderBy: { created_at: 'desc' }
    });

    // Ensure numeric types for frontend
    return bookings.map(b => ({
      ...b,
      total_price: Number(b.total_price),
      final_price: b.final_price ? Number(b.final_price) : null
    }));
  }

  // 10. Suspend a Vendor
  async suspendVendor(vendorId: string) {
    const vendor = await this.prisma.vendorProfile.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) throw new NotFoundException('Vendor not found');

    const updatedVendor = await this.prisma.vendorProfile.update({
      where: { id: vendorId },
      data: {
        approval_status: VendorVerificationStatus.SUSPENDED,
      },
    });

    await this.notificationsService.create(
      vendor.user_id,
      'VENDOR_SUSPENDED',
      'Account Suspended',
      'Your vendor account has been suspended by an administrator.',
      '/vendor/dashboard'
    );

    return updatedVendor;
  }

  // 11. Get All Suspended Vendors
  async getSuspendedVendors() {
    const vendors = await this.prisma.vendorProfile.findMany({
      where: { approval_status: VendorVerificationStatus.SUSPENDED },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        services: true,
      },
      orderBy: { updated_at: 'desc' },
    });

    if (vendors.length === 0) return [];
    
    const vendorIds = vendors.map(v => v.id);

    const [ratings, completedJobs] = await Promise.all([
      this.prisma.review.groupBy({
        by: ['vendor_id'],
        where: { vendor_id: { in: vendorIds } },
        _avg: { rating: true },
        _count: { rating: true }
      }),
      this.prisma.booking.groupBy({
        by: ['vendor_id'],
        where: { vendor_id: { in: vendorIds }, status: 'COMPLETED' },
        _count: { id: true }
      })
    ]);

    const ratingsMap = new Map(ratings.map(r => [r.vendor_id, { avg: r._avg.rating || 0, count: r._count.rating }]));
    const jobsMap = new Map(completedJobs.map(j => [j.vendor_id, j._count.id]));

    return vendors.map(vendor => {
      const ratingInfo = ratingsMap.get(vendor.id) || { avg: 0, count: 0 };
      
      return {
        ...vendor,
        averageRating: Math.round(ratingInfo.avg * 10) / 10,
        totalReviews: ratingInfo.count,
        completedJobsCount: jobsMap.get(vendor.id) || 0
      };
    });
  }
}