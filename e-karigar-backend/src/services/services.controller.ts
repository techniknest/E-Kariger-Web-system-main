
import {
  Controller, Post, Get, Patch, Delete, Body, Param, Request, UseGuards,
  UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus, BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer'; // Use memoryStorage for Cloudinary
import { ServicesService } from './services.service';
import { AuthGuard } from '../auth/auth.guard';
import { CloudinaryService } from '../cloudinary/cloudinary.service'; // Import CloudinaryService

@Controller('services')
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly cloudinaryService: CloudinaryService, // Inject CloudinaryService
  ) { }

  // --- PUBLIC: Homepage ---
  @Get('public')
  async findAll() {
    return this.servicesService.findAll();
  }

  // --- PROTECTED: Vendor Only ---
  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() })) // Use memory storage
  async create(
    @Request() req,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      console.log('Received file:', file.originalname, 'Type:', file.mimetype, 'Size:', file.size);
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(`Invalid file type: ${file.mimetype}.Allowed: ${allowedMimeTypes.join(', ')} `);
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new BadRequestException('File too large. Max 5MB');
      }
    }
    let imageUrls = body.images || [];

    if (file) {
      try {
        const uploadResult = await this.cloudinaryService.uploadImage(file);
        // @ts-ignore
        if (uploadResult.secure_url) {
          // @ts-ignore
          imageUrls = [uploadResult.secure_url];
        }
      } catch (error) {
        console.error("Cloudinary Upload Failed:", error);
        // Handle error or proceed without image
      }
    }

    const serviceData = {
      ...body,
      price: parseFloat(body.price),
      images: imageUrls,
    };
    return this.servicesService.createService(req.user.sub, serviceData);
  }

  @UseGuards(AuthGuard)
  @Get('my')
  async getMyServices(@Request() req) {
    return this.servicesService.getMyServices(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      console.log('Received file for update:', file.originalname, 'Type:', file.mimetype, 'Size:', file.size);
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(`Invalid file type: ${file.mimetype}.Allowed: ${allowedMimeTypes.join(', ')} `);
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new BadRequestException('File too large. Max 5MB');
      }
    }
    const updateData = { ...body };
    if (body.price) updateData.price = parseFloat(body.price);

    if (file) {
      try {
        const uploadResult = await this.cloudinaryService.uploadImage(file);
        // @ts-ignore
        if (uploadResult.secure_url) {
          // @ts-ignore
          updateData.images = [uploadResult.secure_url];
        }
      } catch (error) {
        console.error("Cloudinary Upload Failed:", error);
      }
    }

    return this.servicesService.updateService(req.user.sub, id, updateData);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    return this.servicesService.deleteService(req.user.sub, id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }
}