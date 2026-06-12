import { Controller, Get, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '../auth/auth.guard';

// TODO: Add @Roles('ADMIN') guard for production
@Controller('admin')
@UseGuards(AuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('vendors/pending')
  async getPendingVendors() {
    return this.adminService.getPendingVendors();
  }

  @Get('vendors/approved')
  async getApprovedVendors() {
    return this.adminService.getApprovedVendors();
  }

  @Get('vendors/suspended')
  async getSuspendedVendors() {
    return this.adminService.getSuspendedVendors();
  }

  @Patch('vendors/:id/approve')
  async approveVendor(@Param('id') id: string) {
    return this.adminService.approveVendor(id);
  }

  @Patch('vendors/:id/suspend')
  async suspendVendor(@Param('id') id: string) {
    return this.adminService.suspendVendor(id);
  }

  @Patch('vendors/:id/reject')
  async rejectVendor(@Param('id') id: string) {
    return this.adminService.rejectVendor(id);
  }

  @Get('stats')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Delete('vendors/:id')
  async deleteVendor(@Param('id') id: string) {
    return this.adminService.deleteVendor(id);
  }

  @Delete('services/:id')
  async deleteService(@Param('id') id: string) {
    return this.adminService.deleteService(id);
  }

  @Get('vendors/:id')
  async getVendorDetails(@Param('id') id: string) {
    return this.adminService.getVendorDetails(id);
  }

  @Get('vendors/:id/bookings')
  async getVendorBookings(@Param('id') id: string) {
    return this.adminService.getVendorBookings(id);
  }
}