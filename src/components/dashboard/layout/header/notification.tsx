'use client';

import { markNotificationsAsRead } from '@/actions/notifications';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useNotifications } from '@/hooks/use-notifications';
import { notificationIcons, notificationMessages } from '@/lib/constants';
import { useRouter } from '@/navigation';
import { Notification } from '@prisma/client';
import { IconBell, IconLoader2 } from '@tabler/icons-react';
import { Router } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type CompProps = {};
export default function NotificationDropdown({}: CompProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('dashboard.notifications');
  const user = useCurrentUser();
  const locale = useLocale();
  const { notifications = [], isLoading, isError, mutate } = useNotifications();
  const router = useRouter();

  useEffect(() => {
    async function markRead() {
      if (open && user?.id) {
        await markNotificationsAsRead(user.id);
        mutate();
      }
    }
    markRead();
  }, [open, user?.id, mutate]);

  const unreadCount = notifications.filter((notification: Notification) => !notification.read).length;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="relative" variant={'outline'} size={'icon'}>
          {unreadCount > 0 && (
            <Badge variant={'secondary'} className="absolute right-0 top-0 h-5 w-5 rounded-full px-1 py-1 text-white">
              {unreadCount}
            </Badge>
          )}
          <IconBell />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className=" custom-scrollbar mt-4 max-h-96 w-96 bg-background text-xl"
        align="end"
        forceMount>
        <DropdownMenuLabel className="py-2 font-normal">
          <div className="flex flex-col space-y-2">
            <p className="text-md font-medium leading-none">{t('menu-title')}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <IconLoader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notification: Notification) => {
            const IconComponent = notificationIcons[notification.type];
            return (
              <DropdownMenuItem
                key={notification.id}
                className="min-h-16  cursor-pointer border-b border-border"
                onClick={() => {
                  setOpen(false);
                  router.push(notification.link ?? '/dashboard');
                }}>
                <div className="flex flex-row items-center justify-center space-x-4 px-2">
                  <div className="rounded-full border border-border bg-page p-2 text-primary">
                    <IconComponent className="h-6 w-6 " />
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
              </DropdownMenuItem>
            );
          })
        ) : (
          <DropdownMenuItem className="min-h-14 focus:bg-background">
            <div className="mx-auto  space-x-4 px-2 text-muted-foreground">
              <p>{t('no-notifications')}</p>
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
