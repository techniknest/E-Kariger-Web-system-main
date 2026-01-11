import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt'; // Required for AuthGuard

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET, // MUST match AuthModule secret
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [ServicesController],
  providers: [ServicesService, PrismaService],
})
export class ServicesModule {}