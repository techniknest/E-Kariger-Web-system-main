import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { AuthGuard } from '../auth/auth.guard';

// DTO for vendor application
interface VendorApplicationDto {
    city: string;
    cnic: string;
    business_phone: string;
    experience_years: number;
    description: string;
    vendor_type: string;
}

@Controller('vendors')
export class VendorsController {
    constructor(private readonly vendorsService: VendorsService) { }

    // Apply to become a vendor (authenticated clients only)
    @UseGuards(AuthGuard)
    @Post('apply')
    async applyToBecomeVendor(
        @Request() req,
        @Body() body: VendorApplicationDto,
    ) {
        return this.vendorsService.applyToBecomeVendor(req.user.sub, body);
    }

    // Get current vendor status
    @UseGuards(AuthGuard)
    @Get('status')
    async getVendorStatus(@Request() req) {
        return this.vendorsService.getVendorStatus(req.user.sub);
    }

    // Get vendor profile details
    @UseGuards(AuthGuard)
    @Get('profile')
    async getVendorProfile(@Request() req) {
        return this.vendorsService.getVendorProfile(req.user.sub);
    }
}
