import { Controller, Post, Get, Patch, Body, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

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
  @UseInterceptors(FileInterceptor('profilePhoto', { storage: memoryStorage() }))
  async updateProfile(
    @Request() req,
    @Body() body: { name?: string; phone?: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    let profilePhotoUrl = undefined;

    if (file) {
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(`Invalid file type. Allowed: ${allowedMimeTypes.join(', ')}`);
      }
      if (file.size > 2 * 1024 * 1024) {
        throw new BadRequestException('File too large. Max 2MB');
      }

      try {
        const uploadResult = await this.cloudinaryService.uploadImage(file);
        // @ts-ignore
        profilePhotoUrl = uploadResult.secure_url;
      } catch (error) {
        console.error("Cloudinary Upload Failed:", error);
        throw new BadRequestException("Failed to upload profile photo");
      }
    }

    return this.authService.updateProfile(req.user.sub, {
      ...body,
      profile_photo: profilePhotoUrl,
    });
  }
}