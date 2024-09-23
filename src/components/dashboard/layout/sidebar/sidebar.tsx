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
        `custom-scrollbar relative hidden h-full overflow-y-auto border-r pb-3 pt-10 ease-in-out md:flex md:flex-col`,
        !isMinimized ? 'w-64' : 'w-[64px]',
        className,
      )}
      style={{ transition: 'width 0.2s' }}>
      <div className="h-full space-y-4  py-4">
        <div className="h-full px-3  py-2">
          <div className="mt-6 h-full space-y-8">
            {!isMinimized && (
              <div className={'mb-5 flex flex-col items-center gap-3'}>
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    className="object-cover"
                    src={`${MEDIA_HOSTNAME}${user?.image}` ?? ''}
                    alt={user?.name ?? ''}
                  />
                  <AvatarFallback className="text-xl">
                    {user!.name!.split(' ')[0][0] + user!.name!.split(' ')[1][0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center ">
                  <h1 className="text-lg font-bold">{user?.name}</h1>
                  <p className="text-sm font-medium text-muted-foreground">{t(user?.role.toLocaleLowerCase())}</p>
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
