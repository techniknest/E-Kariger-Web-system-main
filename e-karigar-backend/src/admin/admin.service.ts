import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { VendorVerificationStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // 1. Get All Pending Vendors
  async getPendingVendors() {
    return this.prisma.vendorProfile.findMany({
      where: { approval_status: VendorVerificationStatus.PENDING },
      include: {
        user: {
          select: { name: true, email: true, phone: true },
        },
      },
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
        is_verified: true, // SRS: Optional verification logic can be expanded later
      },
    });
  }
}