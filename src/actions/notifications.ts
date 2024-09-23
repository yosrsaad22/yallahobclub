'use server';
import { db } from '@/lib/db';
import { roleGuard } from '@/lib/auth';
import { NotificationType, UserRole } from '@prisma/client';
import { ActionResponse } from '@/types';
import { getNotificationsByUserId } from '@/data/notification';

export async function notifyUser(userId: string, type: NotificationType, subject?: string): Promise<ActionResponse> {
  try {
    await db.notification.create({
      data: {
        userId,
        type,
        subject,
      },
    });
    return { success: 'notification-send-success' };
  } catch (error) {
    return { error: 'notification-send-error' };
  }
}

export async function notifyAllAdmins(type: NotificationType, subject?: string): Promise<ActionResponse> {
  try {
    const admins = await db.user.findMany({
      where: { role: UserRole.ADMIN },
      select: { id: true },
    });

    if (!admins) return { error: 'admins-not-found-error' };

    const notifications = admins.map((admin) => ({
      userId: admin.id,
      type,
      subject,
    }));

    await db.notification.createMany({
      data: notifications,
    });
    return { success: 'notification-send-success' };
  } catch (error) {
    return { error: 'notification-send-error' };
  }
}

export async function markNotificationsAsRead(userId: string) {
  roleGuard(UserRole.ADMIN || UserRole.SELLER || UserRole.SUPPLIER);
  try {
    await db.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    return { success: 'notifications-read-success' };
  } catch (error) {
    return { success: 'notifications-read-error' };
  }
}
