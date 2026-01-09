import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma.service'; // Import this

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaService], // Add PrismaService here
})
export class AdminModule {}