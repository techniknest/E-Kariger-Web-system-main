import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) {}

    async create(userId: string, type: string, title: string, message: string, link?: string) {
        return this.prisma.notification.create({
            data: {
                user_id: userId,
                type,
                title,
                message,
                link,
            },
        });
    }

    async findAllForUser(userId: string) {
        return this.prisma.notification.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' },
        });
    }

    async markAsRead(notificationId: string, userId: string) {
        return this.prisma.notification.updateMany({
            where: { id: notificationId, user_id: userId },
            data: { is_read: true },
        });
    }

    async markAllAsRead(userId: string) {
        return this.prisma.notification.updateMany({
            where: { user_id: userId, is_read: false },
            data: { is_read: true },
        });
    }
}
