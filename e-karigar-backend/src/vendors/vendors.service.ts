import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { VendorVerificationStatus } from '@prisma/client';

interface VendorApplicationDto {
    city: string;
    cnic: string;
    business_phone: string;
    experience_years: number;
    description: string;
    vendor_type: string;
}

@Injectable()
export class VendorsService {
    constructor(private prisma: PrismaService) { }

    // Apply to become a vendor
    async applyToBecomeVendor(userId: string, data: VendorApplicationDto) {
        // 1. Check if user already has a vendor profile
        const existingProfile = await this.prisma.vendorProfile.findUnique({
            where: { user_id: userId },
        });

        if (existingProfile) {
            throw new ConflictException('You have already applied to become a seller.');
        }

        // 2. Check CNIC uniqueness
        if (data.cnic) {
            const existingCNIC = await this.prisma.vendorProfile.findFirst({
                where: { cnic: data.cnic },
            });
            if (existingCNIC) {
                throw new ConflictException('This CNIC is already registered with another vendor.');
            }
        }

        // 3. Create vendor profile with PENDING status
        const vendorProfile = await this.prisma.vendorProfile.create({
            data: {
                user_id: userId,
                city: data.city,
                cnic: data.cnic,
                business_phone: data.business_phone,
                experience_years: data.experience_years,
                description: data.description,
                vendor_type: data.vendor_type || 'INDIVIDUAL',
                approval_status: VendorVerificationStatus.PENDING,
            },
        });

        return {
            message: 'Application submitted successfully! You will be notified once approved.',
            status: 'PENDING',
            vendorProfile,
        };
    }

    // Get vendor application status
    async getVendorStatus(userId: string) {
        const profile = await this.prisma.vendorProfile.findUnique({
            where: { user_id: userId },
        });

        if (!profile) {
            return {
                status: 'NONE',
                canAddService: false,
                hasApplied: false,
            };
        }

        return {
            status: profile.approval_status,
            canAddService: profile.approval_status === 'APPROVED',
            hasApplied: true,
            isApproved: profile.approval_status === 'APPROVED',
            isPending: profile.approval_status === 'PENDING',
            isRejected: profile.approval_status === 'REJECTED',
        };
    }

    // Get full vendor profile
    async getVendorProfile(userId: string) {
        const profile = await this.prisma.vendorProfile.findUnique({
            where: { user_id: userId },
            include: {
                user: {
                    select: { name: true, email: true },
                },
                services: true,
            },
        });

        if (!profile) {
            throw new NotFoundException('Vendor profile not found');
        }

        return profile;
    }
}
