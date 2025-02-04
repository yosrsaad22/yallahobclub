'use client';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MenuIcon } from 'lucide-react';
import { useState } from 'react';
import { adminNavItems, sellerNavItems, supplierNavItems } from '@/lib/constants';
import { DashboardNav } from '@/components/dashboard/layout/sidebar/dashboard-nav';
import { Button } from '@/components/ui/button';
import { useCurrentRole } from '@/hooks/use-current-role';
import { UserRole } from '@prisma/client';
import { NavItem } from '@/types';
import { useTranslations } from 'next-intl';
import { useNotifications } from '@/hooks/use-notifications';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MobileSidebar({ className }: SidebarProps) {
  const [open, setOpen] = useState(false);
  let translatedNavItems: NavItem[] = [];
  const t = useTranslations('dashboard.sidebar');

  const role = useCurrentRole();

  switch (role) {
    case UserRole.ADMIN:
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
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="flex items-center" asChild>
          <Button variant={'outline'} size={'icon'}>
            <MenuIcon className="h-[1.4rem] w-[1.4rem]" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="bg-gradient-to-b from-primary via-primary/90 to-secondary/80 !px-0 text-white">
          <div className="">
            <div className="px-4">
              <h2 className="mb-8  text-lg font-semibold tracking-tight">Navigation</h2>
              <div className="space-y-1">
                <DashboardNav items={translatedNavItems} isMobileNav={true} setOpen={setOpen} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
