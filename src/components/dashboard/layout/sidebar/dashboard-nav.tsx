import { cn } from '@/lib/utils';
import { NavItem } from '@/types';
import { Dispatch, SetStateAction, useEffect, useCallback } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from '@/hooks/use-sidebar';
import { Link, usePathname } from '@/navigation';
import { Badge } from '@/components/ui/badge';
import { markNotificationsAsRead } from '@/actions/notifications';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useNotifications } from '@/hooks/use-notifications';
import { useTranslations } from 'next-intl';
import { Notification } from '@prisma/client';

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function DashboardNav({ items, setOpen, isMobileNav = false }: DashboardNavProps) {
  const path = usePathname();
  const { isMinimized, toggle } = useSidebar();
  const user = useCurrentUser();
  const { notifications = [], mutate } = useNotifications();
  const t = useTranslations('dashboard.sidebar');

  const markRead = useCallback(async () => {
    if (user?.id) {
      await markNotificationsAsRead(user.id);
      mutate();
    }
  }, [user?.id, mutate]);

  useEffect(() => {
    markRead();
  }, [setOpen, user?.id, markRead]);

  if (!items?.length) {
    return null;
  }

  let navItems = items.map((item) => {
    const unreadNotifications = notifications.filter((notification: Notification) => notification.read === false);
    const notificationsCount = unreadNotifications.filter((notification: Notification) =>
      item.title.includes(notification.type.split('_')[2].toLowerCase()),
    ).length;
    return {
      ...item,
      title: t(item.title),
      notificationsCount: notificationsCount,
    };
  });

  return (
    <nav className="flex flex-col justify-between">
      <TooltipProvider>
        <div className="flex flex-col justify-start gap-1">
          {navItems.map(
            (item, index) =>
              item.href && (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'relative flex items-center justify-start gap-4 overflow-hidden rounded-md px-[0.35rem] py-[0.35rem] text-sm font-medium hover:bg-primary/80 hover:text-white ',
                        (path.split('/')[2] === 'marketplace' && items[index].title === 'marketplace') ||
                          path.split('/')[3] === items[index].title ||
                          (path.split('/')[3] === undefined &&
                            items[index].title === 'dashboard' &&
                            path.split('/')[2] !== 'marketplace')
                          ? 'bg-primary/80 text-white'
                          : '',
                      )}
                      onClick={async () => {
                        if (setOpen) setOpen(false);
                        if (!isMinimized && items[index].title === 'marketplace') toggle();
                        await markRead();
                      }}>
                      {item.icon}
                      {isMinimized && !!item.notificationsCount && item.notificationsCount > 0 && (
                        <Badge
                          variant={'secondary'}
                          className="absolute right-0 top-0 h-5 w-5 rounded-full px-1 py-1 text-white">
                          {item.notificationsCount}
                        </Badge>
                      )}

                      {isMobileNav || (!isMinimized && !isMobileNav) ? (
                        <div className="flex w-full flex-row justify-between">
                          <span className="mr-2 truncate">{item.title}</span>
                          {!!item.notificationsCount && item.notificationsCount > 0 && (
                            <Badge variant={'secondary'} className="h-5 w-5 rounded-full px-1 py-1 text-white">
                              {item.notificationsCount}
                            </Badge>
                          )}
                        </div>
                      ) : null}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    align="center"
                    side="right"
                    sideOffset={8}
                    className={!isMinimized ? 'hidden bg-background' : 'inline-block bg-background'}>
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              ),
          )}
        </div>
      </TooltipProvider>
    </nav>
  );
}
