import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) { }

    async createReview(userId: string, dto: CreateReviewDto) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: dto.bookingId },
            include: { review: true, vendor: true },
        });

        if (!booking) throw new NotFoundException('Booking not found');

        if (booking.client_id !== userId) {
            throw new BadRequestException('You can only review your own bookings');
        }

        if (booking.status !== BookingStatus.COMPLETED) {
            throw new BadRequestException('You can only review completed bookings');
        }

        if (booking.review) {
            throw new BadRequestException('You have already reviewed this booking');
        }

        return this.prisma.review.create({
            data: {
                booking_id: dto.bookingId,
                client_id: userId,
                vendor_id: booking.vendor_id,
                rating: dto.rating,
                comment: dto.comment,
            },
            include: {
                client: { select: { name: true } },
            },
        });
    }

    async getVendorReviews(vendorId: string) {
        const reviews = await this.prisma.review.findMany({
            where: { vendor_id: vendorId },
            include: {
                client: { select: { name: true } },
            },
            orderBy: { created_at: 'desc' },
        });

        // Compute aggregate
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10
            : 0;

        return {
            averageRating,
            totalReviews,
            reviews,
        };
    }

    async getVendorRatingByUserId(userId: string) {
        const vendor = await this.prisma.vendorProfile.findUnique({
            where: { user_id: userId },
        });

        if (!vendor) return { averageRating: 0, totalReviews: 0 };

        const aggregate = await this.prisma.review.aggregate({
            where: { vendor_id: vendor.id },
            _avg: { rating: true },
            _count: { rating: true },
        });

        return {
            averageRating: Math.round((aggregate._avg.rating || 0) * 10) / 10,
            totalReviews: aggregate._count.rating,
        };
    }
}
