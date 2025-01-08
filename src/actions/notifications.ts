'use server';
import { db } from '@/lib/db';
import { currentUser, roleGuard } from '@/lib/auth';
import { NotificationType, UserRole } from '@prisma/client';
import { ActionResponse } from '@/types';
import { getNotificationsByUserId } from '@/data/notification';
import { revalidatePath } from 'next/cache';

export const getNotifications = async (id: string): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.ADMIN, UserRole.SELLER, UserRole.SUPPLIER]);
    const notification = await getNotificationsByUserId(id);
    return { success: 'notification-fetch-success', data: notification };
  } catch {
    return { error: 'notification-fetch-error' };
  }
};

export async function notifyUser(
  userId: string,
  type: NotificationType,
  link: string,
  subject?: string,
): Promise<ActionResponse> {
  try {
    await db.notification.create({
      data: {
        userId,
        type,
        subject,
        link,
      },
    });
    return { success: 'notification-send-success' };
  } catch (error) {
    return { error: 'notification-send-error' };
  }
}

export async function notifyAllAdmins(type: NotificationType, link: string, subject?: string): Promise<ActionResponse> {
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
      link,
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
  try {
    await roleGuard([UserRole.ADMIN, UserRole.SELLER, UserRole.SUPPLIER]);

    await db.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    return { success: 'notifications-read-success' };
  } catch (error) {
    return { success: 'notifications-read-error' };
  }
}

export const deleteNotificationById = async (notificationId: string): Promise<ActionResponse> => {
  await roleGuard([UserRole.ADMIN, UserRole.SELLER, UserRole.SUPPLIER]);
  try {
    await db.notification.delete({
      where: {
        id: notificationId,
      },
    });
    // revalidatePath('/dashboard/notifications');
    return { success: 'notification-delete-success' };
  } catch {
    return { error: 'notification-delete-error' };
  }
};

export async function deleteAllNotifications(): Promise<ActionResponse> {
  try {
    await roleGuard([UserRole.ADMIN, UserRole.SELLER, UserRole.SUPPLIER]);
    const user = await currentUser();
    await db.notification.deleteMany({
      where: { userId: user?.id },
    });
    revalidatePath('/dashboard/notifications');
    return { success: 'notifications-delete-success' };
  } catch {
    return { error: 'notifications-delete-error' };
  }
}

export const cleanNotifications = async () => {
  try {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 5);

    const { count } = await db.notification.deleteMany({
      where: {
        createdAt: {
          lt: twoWeeksAgo,
        },
      },
    });
    if (count > 0) {
      console.log(`Deleted ${count} notifications during cleanup.`);
    } else {
      console.log('No notifications to delete during cleanup.');
    }
  } catch (error) {
    console.log(error);
  }
};
