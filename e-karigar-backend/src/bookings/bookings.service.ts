import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { StartJobDto } from './dto/start-job.dto';
import { ReviseQuoteDto } from './dto/revise-quote.dto';
import { ApproveRevisionDto } from './dto/approve-revision.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
    constructor(private prisma: PrismaService, private notificationsService: NotificationsService) { }

    /**
     * Generate a random 4-digit OTP string (0000–9999).
     */
    private generateOtp(): string {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    async create(userId: string, createBookingDto: CreateBookingDto) {
        const { serviceId, scheduledDate, problemDescription, address, totalPrice } = createBookingDto;

        const date = new Date(scheduledDate);
        if (date < new Date()) {
            throw new BadRequestException('Scheduled date must be in the future');
        }

        const service = await this.prisma.service.findUnique({
            where: { id: serviceId },
            include: { vendor: true },
        });

        if (!service) {
            throw new NotFoundException('Service not found');
        }

        if (service.vendor.user_id === userId) {
            throw new BadRequestException('You cannot book your own service');
        }

        const existingActiveBooking = await this.prisma.booking.findFirst({
            where: {
                client_id: userId,
                service_id: serviceId,
                status: {
                    in: [
                        BookingStatus.PENDING,
                        BookingStatus.ACCEPTED,
                        BookingStatus.IN_PROGRESS,
                        BookingStatus.WAITING_APPROVAL,
                    ],
                },
            },
        });

        if (existingActiveBooking) {
            throw new BadRequestException('You already have an active booking for this service');
        }

        const booking = await this.prisma.booking.create({
            data: {
                client_id: userId,
                vendor_id: service.vendor.id,
                service_id: serviceId,
                scheduled_date: date,
                problem_description: problemDescription,
                address: address,
                total_price: totalPrice,
                start_otp: this.generateOtp(),
                status: BookingStatus.PENDING,
            },
        });

        await this.notificationsService.create(
            service.vendor.user_id,
            'NEW_BOOKING',
            'New Booking Received',
            'You have received a new booking from a client.',
            '/vendor/jobs'
        );

        return booking;
    }

    async findAllByClient(clientId: string) {
        return this.prisma.booking.findMany({
            where: { client_id: clientId },
            include: {
                service: true,
                vendor: {
                    include: { user: { select: { name: true, email: true, phone: true } } }
                },
                review: true,
            },
            orderBy: { created_at: 'desc' },
        });
    }

    async findAllByVendor(userId: string) {
        const vendorProfile = await this.prisma.vendorProfile.findUnique({
            where: { user_id: userId }
        });

        if (!vendorProfile) {
            return [];
        }

        return this.prisma.booking.findMany({
            where: { vendor_id: vendorProfile.id },
            include: {
                service: true,
                client: { select: { name: true, email: true, phone: true } },
            },
            orderBy: { created_at: 'desc' },
        });
    }

    async updateStatus(id: string, updateDto: UpdateBookingStatusDto, userId: string) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: { vendor: true }
        });

        if (!booking) throw new NotFoundException('Booking not found');

        if (booking.vendor.user_id !== userId) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (!user || user.role !== 'ADMIN') {
                throw new ForbiddenException('You are not authorized to update this booking');
            }
        }

        const updatedBooking = await this.prisma.booking.update({
            where: { id },
            data: { status: updateDto.status }
        });

        if (userId === booking.vendor.user_id) {
            await this.notificationsService.create(
                booking.client_id,
                'BOOKING_STATUS_UPDATE',
                'Booking Status Updated',
                `Your booking status has been updated to ${updateDto.status}.`,
                '/client/history'
            );
        }

        return updatedBooking;
    }

    // ─── Feature A: Start Job (OTP Handshake) ───────────────────────────

    async startJob(id: string, dto: StartJobDto, userId: string) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: { vendor: true },
        });

        if (!booking) throw new NotFoundException('Booking not found');

        // Only the vendor who owns this booking can start the job
        if (booking.vendor.user_id !== userId) {
            throw new ForbiddenException('You are not authorized to start this job');
        }

        if (booking.status !== BookingStatus.ACCEPTED) {
            throw new BadRequestException('Job can only be started when the booking is ACCEPTED');
        }

        if (dto.otp !== booking.start_otp) {
            throw new BadRequestException('Invalid OTP. Please ask the client for the correct code.');
        }

        const updatedBooking = await this.prisma.booking.update({
            where: { id },
            data: { status: BookingStatus.IN_PROGRESS },
        });

        await this.notificationsService.create(
            booking.client_id,
            'JOB_STARTED',
            'Job Started',
            'Your vendor has started the job successfully.',
            '/client/history'
        );

        return updatedBooking;
    }

    // ─── Feature B: Revise Quote ────────────────────────────────────────

    async reviseQuote(id: string, dto: ReviseQuoteDto, userId: string) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: { vendor: true },
        });

        if (!booking) throw new NotFoundException('Booking not found');

        if (booking.vendor.user_id !== userId) {
            throw new ForbiddenException('You are not authorized to revise this quote');
        }

        if (booking.status !== BookingStatus.ACCEPTED && booking.status !== BookingStatus.IN_PROGRESS) {
            throw new BadRequestException('Price can only be revised when the booking is ACCEPTED or IN_PROGRESS');
        }

        const updatedBooking = await this.prisma.booking.update({
            where: { id },
            data: {
                final_price: dto.new_price,
                is_price_revised: true,
                revision_reason: dto.reason,
                status: BookingStatus.WAITING_APPROVAL,
            },
        });

        await this.notificationsService.create(
            booking.client_id,
            'QUOTE_REVISED',
            'Price Revision Requested',
            `The vendor has requested a price revision for your booking. Reason: ${dto.reason}`,
            '/client/history'
        );

        return updatedBooking;
    }

    // ─── Feature C: Approve / Reject Revised Quote ──────────────────────

    async approveRevision(id: string, dto: ApproveRevisionDto, userId: string) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: { vendor: true },
        });

        if (!booking) throw new NotFoundException('Booking not found');

        // Only the client who owns this booking can approve/reject
        if (booking.client_id !== userId) {
            throw new ForbiddenException('You are not authorized to approve this revision');
        }

        if (booking.status !== BookingStatus.WAITING_APPROVAL) {
            throw new BadRequestException('No pending revision to approve');
        }

        if (dto.approved) {
            const updatedBooking = await this.prisma.booking.update({
                where: { id },
                data: { status: BookingStatus.IN_PROGRESS },
            });

            await this.notificationsService.create(
                booking.vendor.user_id,
                'REVISION_APPROVED',
                'Price Revision Approved',
                'The client has approved your price revision.',
                '/vendor/jobs'
            );

            return updatedBooking;
        } else {
            const updatedBooking = await this.prisma.booking.update({
                where: { id },
                data: { status: BookingStatus.CANCELLED },
            });

            await this.notificationsService.create(
                booking.vendor.user_id,
                'REVISION_REJECTED',
                'Price Revision Rejected',
                'The client has rejected your price revision and the booking is cancelled.',
                '/vendor/jobs'
            );

            return updatedBooking;
        }
    }
}
