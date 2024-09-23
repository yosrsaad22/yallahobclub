import { db } from '@/lib/db';

export const getNotificationsByUserId = async (userId: string) => {
  try {
    const notifications = await db.notification.findMany({
      where: {
        userId,
      },
      orderBy: { createdAt: 'desc' },
    });
    return notifications;
  } catch {
    return null;
  }
};
