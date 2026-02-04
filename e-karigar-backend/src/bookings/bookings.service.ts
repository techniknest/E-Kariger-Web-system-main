import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
    constructor(private prisma: PrismaService) { }

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

        return this.prisma.booking.create({
            data: {
                client_id: userId,
                vendor_id: service.vendor.id,
                service_id: serviceId,
                scheduled_date: date,
                problem_description: problemDescription,
                address: address,
                total_price: totalPrice,
                status: BookingStatus.PENDING,
            },
        });
    }

    async findAllByClient(clientId: string) {
        return this.prisma.booking.findMany({
            where: { client_id: clientId },
            include: {
                service: true,
                vendor: {
                    include: { user: { select: { name: true, email: true, phone: true } } }
                }
            },
            orderBy: { created_at: 'desc' },
        });
    }

    async findAllByVendor(userId: string) {
        const vendorProfile = await this.prisma.vendorProfile.findUnique({
            where: { user_id: userId }
        });

        if (!vendorProfile) {
            // If user is vendor but no profile? separate issue, but return empty
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

        // Check ownership or ADMIN
        if (booking.vendor.user_id !== userId) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (!user || user.role !== 'ADMIN') {
                throw new ForbiddenException('You are not authorized to update this booking');
            }
        }

        return this.prisma.booking.update({
            where: { id },
            data: { status: updateDto.status }
        });
    }
}
