import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { VendorVerificationStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

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

    return this.prisma.vendorProfile.update({
      where: { id: vendorId },
      data: {
        approval_status: VendorVerificationStatus.APPROVED,
        is_verified: true,
      },
    });
  }

  // 3. Reject a Vendor
  async rejectVendor(vendorId: string) {
    const vendor = await this.prisma.vendorProfile.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) throw new NotFoundException('Vendor not found');

    return this.prisma.vendorProfile.update({
      where: { id: vendorId },
      data: {
        approval_status: VendorVerificationStatus.REJECTED,
      },
    });
  }

  // 4. Get All Approved Vendors
  async getApprovedVendors() {
    return this.prisma.vendorProfile.findMany({
      where: { approval_status: VendorVerificationStatus.APPROVED },
      include: {
        user: {
          select: { name: true, email: true, phone: true },
        },
        services: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  // 5. Get Dashboard Stats
  async getDashboardStats() {
    const [pendingCount, approvedCount, totalUsers, totalServices] = await Promise.all([
      this.prisma.vendorProfile.count({ where: { approval_status: VendorVerificationStatus.PENDING } }),
      this.prisma.vendorProfile.count({ where: { approval_status: VendorVerificationStatus.APPROVED } }),
      this.prisma.user.count(),
      this.prisma.service.count(),
    ]);

    return {
      pendingVendors: pendingCount,
      approvedVendors: approvedCount,
      totalUsers,
      totalServices,
    };
  }
}