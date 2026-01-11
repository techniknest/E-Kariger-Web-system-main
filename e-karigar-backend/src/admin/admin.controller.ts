import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';

// TODO: In the next step, we will add the @Roles('ADMIN') guard here
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('vendors/pending')
  async getPendingVendors() {
    return this.adminService.getPendingVendors();
  }

  @Patch('vendors/:id/approve')
  async approveVendor(@Param('id') id: string) {
    return this.adminService.approveVendor(id);
  }
}