import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
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
}