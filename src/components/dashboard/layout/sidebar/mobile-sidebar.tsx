'use client';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MenuIcon } from 'lucide-react';
import { useState } from 'react';
import { adminNavItems, userNavItems } from '@/lib/constants';
import { DashboardNav } from '@/components/dashboard/layout/sidebar/dashboard-nav';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/use-current-user';
import { UserRole } from '@prisma/client';
import { NavItem } from '@/types';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MobileSidebar({ className }: SidebarProps) {
  const [open, setOpen] = useState(false);
  let navItems: NavItem[] = [];
  const user = useCurrentUser();

  switch (user?.role) {
    case UserRole.ADMIN:
      navItems = adminNavItems;
      break;

    case UserRole.USER:
      navItems = userNavItems;
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
        <SheetContent side="left" className="bg-sidebar !px-0 text-white">
          <div className="">
            <div className="px-4">
              <h2 className="mb-8  text-lg font-semibold tracking-tight">Navigation</h2>
              <div className="space-y-1">
                <DashboardNav items={navItems} isMobileNav={true} setOpen={setOpen} />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
