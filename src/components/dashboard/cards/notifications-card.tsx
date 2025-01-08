'use client';
import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Notification } from '@prisma/client';
import { useRouter } from '@/navigation';
import { cn } from '@/lib/utils';
import { ActionResponse } from '@/types';
import { useCurrentUser } from '@/hooks/use-current-user';
import { toast } from '@/components/ui/use-toast';
import { notificationIcons, notificationMessages } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { IconLoader2, IconTrash, IconX } from '@tabler/icons-react';

interface NotificationsCardProps {
  notifications: Notification[];
  onDeleteNotification: (id: string) => Promise<ActionResponse>;
  onDeleteAllNotifications: () => Promise<ActionResponse>;
}

export const NotificationsCard: React.FC<NotificationsCardProps> = ({
  notifications,
  onDeleteNotification,
  onDeleteAllNotifications,
}) => {
  const t = useTranslations('dashboard.notifications');
  const tValidation = useTranslations('validation');
  const router = useRouter();
  const user = useCurrentUser();
  const locale = useLocale();

  const [isSingleDeleteLoading, setIsSingleDeleteLoading] = useState(false);
  const [isBulkDeleteLoading, setIsBulkDeleteLoading] = useState(false);

  const [deletedNotifications, setDeletedNotifications] = useState<string[]>([]);

  const handleDelete = async (id: string) => {
    setIsSingleDeleteLoading(true);
    try {
      const res = await onDeleteNotification(id);
      if (res.success) {
        // Mark the notification as deleted for immediate removal
        setDeletedNotifications((prev) => [...prev, id]);

        toast({
          variant: 'success',
          title: tValidation('success-title'),
          description: tValidation(res.success),
        });
      } else {
        toast({
          variant: 'destructive',
          title: tValidation('error-title'),
          description: tValidation(res.error),
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: tValidation('error-title'),
        description: tValidation('notification-delete-error'),
      });
    } finally {
      setIsSingleDeleteLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    setIsBulkDeleteLoading(true);
    try {
      const res = await onDeleteAllNotifications();
      if (res.success) {
        toast({
          variant: 'success',
          title: tValidation('success-title'),
          description: tValidation(res.success),
        });
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: tValidation('error-title'),
          description: tValidation(res.error),
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: tValidation('error-title'),
        description: tValidation('notification-delete-error'),
      });
    } finally {
      setIsBulkDeleteLoading(false);
    }
  };

  return (
    <div className={cn('flex w-full flex-col gap-4')}>
      <div className="flex w-full flex-row items-center justify-end">
        <Button size="sm" variant={'destructive'} onClick={handleDeleteAll} disabled={isBulkDeleteLoading}>
          {isBulkDeleteLoading ? (
            <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <IconTrash className="mr-2 h-5 w-5" />
          )}
          {t('delete-all')}
        </Button>
      </div>
      {notifications.length > 0 ? (
        notifications.map((notification: Notification) => {
          // Skip rendering if the notification is in deletedNotifications
          if (deletedNotifications.includes(notification.id)) return null;

          const IconComponent = notificationIcons[notification.type];

          return (
            <div
              key={notification.id}
              className="min-h-16 cursor-pointer rounded-md border border-border bg-background p-4 hover:border-primary"
              onClick={() => {
                router.push(notification.link ?? '/dashboard');
              }}>
              <div className="flex flex-row items-center justify-between px-2">
                <div className="flex flex-row items-center gap-4">
                  <div className="rounded-full border border-border bg-muted p-3 text-primary">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p>
                      {notification.subject
                        ? t(notificationMessages[notification.type], { subject: notification.subject })
                        : t(notificationMessages[notification.type])}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Intl.DateTimeFormat(locale, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: false,
                      }).format(new Date(notification.createdAt))}
                    </span>
                  </div>
                </div>

                <Button
                  className="ml-4"
                  size={'icon'}
                  variant={'outline'}
                  disabled={isSingleDeleteLoading}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the onClick for the parent div
                    handleDelete(notification.id);
                  }}>
                  <IconX className="h-5 w-5 text-destructive" />
                </Button>
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex min-h-24 flex-col items-center justify-center focus:bg-background">
          <div className="mx-auto space-x-4 px-2 text-muted-foreground">
            <p>{t('no-notifications')}</p>
          </div>
        </div>
      )}
    </div>
  );
};
