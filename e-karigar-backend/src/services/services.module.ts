import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    AuthModule,
    CloudinaryModule,
  ],
  controllers: [ServicesController],
  providers: [ServicesService, PrismaService],
})
export class ServicesModule { }