import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @UseGuards(AuthGuard)
    @Post()
    create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
        return this.bookingsService.create(req.user.sub, createBookingDto);
    }

    @UseGuards(AuthGuard)
    @Get('client')
    findAllByClient(@Request() req) {
        return this.bookingsService.findAllByClient(req.user.sub);
    }

    @UseGuards(AuthGuard)
    @Get('vendor')
    findAllByVendor(@Request() req) {
        return this.bookingsService.findAllByVendor(req.user.sub);
    }

    @UseGuards(AuthGuard)
    @Patch(':id/status')
    updateStatus(@Request() req, @Param('id') id: string, @Body() updateBookingStatusDto: UpdateBookingStatusDto) {
        return this.bookingsService.updateStatus(id, updateBookingStatusDto, req.user.sub);
    }
}
