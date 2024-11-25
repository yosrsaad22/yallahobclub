'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/use-sidebar';
import { MEDIA_HOSTNAME, adminNavItems, sellerNavItems, supplierNavItems } from '@/lib/constants';
import { DashboardNav } from '@/components/dashboard/layout/sidebar/dashboard-nav';
import { useTranslations } from 'next-intl';
import { useCurrentUser } from '@/hooks/use-current-user';
import { NavItem } from '@/types';
import { UserRole } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconUser } from '@tabler/icons-react';

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const t = useTranslations('dashboard.sidebar');
  let translatedNavItems: NavItem[] = [];
  const user = useCurrentUser();

  switch (user?.role) {
    case UserRole.ADMIN:
      translatedNavItems = adminNavItems;
      break;

    case UserRole.SELLER:
      translatedNavItems = sellerNavItems;
      break;

    case UserRole.SUPPLIER:
      translatedNavItems = supplierNavItems;
      break;
  }

  return (
    <nav
      className={cn(
        `custom-scrollbar relative hidden h-full overflow-y-auto  border-r  ease-in-out lg:flex lg:flex-col`,
        !isMinimized ? 'w-64' : 'w-[62px]',
        className,
      )}
      style={{ transition: 'width 0.2s' }}>
      <div className={cn('h-full space-y-4 py-2  text-white')}>
        <div className="h-full px-3 ">
          <div className={cn(' h-full space-y-6', isMinimized ? 'flex flex-col justify-start' : 'relative ')}>
            {!isMinimized && (
              <div className={'mb-5 flex flex-col items-center gap-3'}>
                <div className="mt-8">
                  <Avatar className="h-20 w-20 bg-[#27272a]">
                    <AvatarImage
                      className="object-cover"
                      src={`${MEDIA_HOSTNAME}${user?.image}`}
                      alt={user?.name ?? ''}
                    />
                    <AvatarFallback className=" bg-[#27272a] text-xl text-gray-400">
                      <IconUser className="h-9 w-9" />
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex flex-col items-center ">
                  <h1 className="text-lg font-bold">{user?.name}</h1>
                  <p className="text-sm font-medium text-white">{t(user?.role.toLocaleLowerCase())}</p>
                </div>
              </div>
            )}

            <DashboardNav items={translatedNavItems} />
          </div>
        </div>
      </div>
    </nav>
  );
}
