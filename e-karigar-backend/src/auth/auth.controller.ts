import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRole } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: { 
    email: string; 
    password: string; 
    name: string; 
    phone: string; 
    role: UserRole;
    city?: string;          // Optional, used only for Vendors
    vendor_type?: string;   // Optional, used only for Vendors
  }) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }
}