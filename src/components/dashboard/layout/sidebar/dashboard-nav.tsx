import { cn } from '@/lib/utils';
import { NavItem } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from '@/hooks/use-sidebar';
import { Link, usePathname } from '@/navigation';
import { Badge } from '@/components/ui/badge';
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
  const path = usePathname(); // Get current route
  const { isMinimized, toggle } = useSidebar();
  const { notifications = [] } = useNotifications();
  const t = useTranslations('dashboard.sidebar');

  if (!items?.length) {
    return null;
  }

  // Updated logic for counting notifications that match the item's href
  const navItems = items.map((item) => {
    // Count the notifications whose `link` includes the item's href
    const notificationsCount =
      item.title === 'dashboard'
        ? 0
        : notifications.filter(
            (notification: Notification) =>
              notification.link && notification.link.includes(item.href!) && notification.read === false,
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
        <div className={cn('flex h-full flex-col justify-start py-2', isMinimized ? 'gap-3' : 'gap-1')}>
          {navItems.map(
            (item, index) =>
              item.href && (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'group relative flex items-center justify-center  gap-4 rounded-md px-[0.35rem] py-[0.35rem] text-sm font-medium hover:bg-background/95 hover:text-foreground/95 ',
                        (path.split('/')[2] === 'marketplace' && items[index].title === 'marketplace') ||
                          path.split('/')[3] === items[index].title ||
                          (path.split('/')[1] === 'dashboard' &&
                            items[index].title === 'dashboard' &&
                            path.split('/')[2] !== 'marketplace' &&
                            path.split('/')[3] === undefined)
                          ? 'bg-background/95   text-foreground/95'
                          : '',
                        isMinimized ? '' : 'pl-2',
                      )}
                      onClick={async () => {
                        if (setOpen) setOpen(false);
                        if (!isMinimized && items[index].title === 'marketplace') toggle();
                      }}>
                      <div
                        className={cn(
                          (path.split('/')[2] === 'marketplace' && items[index].title === 'marketplace') ||
                            path.split('/')[3] === items[index].title ||
                            (path.split('/')[1] === 'dashboard' &&
                              items[index].title === 'dashboard' &&
                              path.split('/')[2] !== 'marketplace' &&
                              path.split('/')[3] === undefined)
                            ? ' text-foreground/95'
                            : 'text-white',
                          'group-hover:text-foreground/95',
                        )}>
                        {item.icon}
                      </div>
                      {isMinimized && item.notificationsCount > 0 && (
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
