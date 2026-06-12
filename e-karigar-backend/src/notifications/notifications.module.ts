import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { PrismaService } from '../prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'super-secret-key',
            signOptions: { expiresIn: '7d' },
        }),
    ],
    controllers: [NotificationsController],
    providers: [NotificationsService, PrismaService],
    exports: [NotificationsService],
})
export class NotificationsModule {}
