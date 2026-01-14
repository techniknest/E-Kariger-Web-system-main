import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '../auth/auth.guard';

// TODO: Add @Roles('ADMIN') guard for production
@Controller('admin')
@UseGuards(AuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('vendors/pending')
  async getPendingVendors() {
    return this.adminService.getPendingVendors();
  }

  @Get('vendors/approved')
  async getApprovedVendors() {
    return this.adminService.getApprovedVendors();
  }

  @Patch('vendors/:id/approve')
  async approveVendor(@Param('id') id: string) {
    return this.adminService.approveVendor(id);
  }

  @Patch('vendors/:id/reject')
  async rejectVendor(@Param('id') id: string) {
    return this.adminService.rejectVendor(id);
  }

  @Get('stats')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }
}