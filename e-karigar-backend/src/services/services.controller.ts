import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { AuthGuard } from '../auth/auth.guard'; // Import the guard we just created

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // --- PUBLIC: Homepage ---
  @Get('public')
  async findAll() {
    return this.servicesService.findAll();
  }

  // --- PROTECTED: Vendor Only ---
  @UseGuards(AuthGuard)
  @Post()
  async create(@Request() req, @Body() body: any) {
    // req.user.sub is the User ID from the token
    return this.servicesService.createService(req.user.sub, body);
  }

  @UseGuards(AuthGuard)
  @Get('my')
  async getMyServices(@Request() req) {
    return this.servicesService.getMyServices(req.user.sub);
  }
}