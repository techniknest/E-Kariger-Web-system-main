import { Controller, Post, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Unified Registration - Always creates CLIENT
  @Post('register')
  register(@Body() body: { 
    email: string; 
    password: string; 
    name: string; 
  }) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body);
  }

  // Get current user info (for token validation / user refresh)
  @UseGuards(AuthGuard)
  @Get('me')
  getCurrentUser(@Request() req) {
    return this.authService.getCurrentUser(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch('profile')
  updateProfile(@Request() req, @Body() body: { name?: string; phone?: string }) {
    return this.authService.updateProfile(req.user.sub, body);
  }
}