'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { IconCoins, IconLoader2, IconMoon, IconSun, IconUser } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useCurrentRole } from '@/hooks/use-current-role';
import { logout } from '@/actions/auth';
import { useRouter } from '@/navigation';
import { useState } from 'react';
import { MEDIA_HOSTNAME } from '@/lib/constants';
import { Dialog } from '@/components/ui/dialog';

export function UserNav() {
  const user = useCurrentUser();
  const role = useCurrentRole();
  const t = useTranslations('dashboard.header');
  const tDialog = useTranslations('dashboard.dialogs');
  const [open, setOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();

  if (user) {
    return (
      <>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative  rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage className="object-cover" src={`${MEDIA_HOSTNAME}${user?.image}`} alt={user.name ?? ''} />
                <AvatarFallback className="text-sm">
                  <IconUser className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mt-4 w-56 bg-background text-xl" align="end" forceMount>
            <DropdownMenuLabel className="py-2 font-normal">
              <div className="flex flex-col space-y-2">
                <p className="text-md font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="text-sm ">
              {(role === 'SELLER' || role === 'SUPPLIER') && (
                <DropdownMenuItem
                  onClick={() => {
                    setOpen(false);
                    router.replace(`/dashboard/${role?.toLowerCase()}/transactions`);
                  }}>
                  {t('user-nav.balance')}

                  <DropdownMenuShortcut>
                    <div className="flex flex-row items-center gap-x-1 font-semibold">
                      <IconCoins className={cn('h-[1rem] w-[1rem]')} />
                      <p className={user.balance >= 0 ? 'text-success' : 'text-destructive'}>{user.balance} TND</p>
                    </div>
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => {
                  setOpen(false);
                  router.replace(`/dashboard/${role?.toLowerCase()}/settings`);
                }}>
                {t('user-nav.settings')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (resolvedTheme === 'dark') {
                    setTheme('light');
                  } else {
                    setTheme('dark');
                  }
                }}>
                {t('user-nav.theme')}
                <DropdownMenuShortcut>
                  <div className={cn(resolvedTheme === 'dark' ? 'hidden' : 'flex', 'flex-row items-center gap-x-1')}>
                    <IconSun className={cn('h-[1rem] w-[1rem]')} />
                    <p>{t('user-nav.light')}</p>
                  </div>
                  <div className={cn(resolvedTheme === 'dark' ? 'flex' : 'hidden', 'flex-row gap-x-1')}>
                    <IconMoon className={cn('h-[1rem] w-[1rem]')} />
                    <p>{t('user-nav.dark')}</p>
                  </div>
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  logout().then(() => {
                    setIsDialogOpen(true);
                    setTimeout(() => {
                      router.replace('/login');
                      setIsDialogOpen(false);
                    }, 2000);
                  })
                }>
                {t('user-nav.logout')}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog
          classname="md:w-[20rem] w-[60%]"
          title={tDialog('logging-out')}
          showCloseButton={false}
          enableInteractOutside={false}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}>
          <div className="flex h-10 w-full flex-col  items-center justify-center md:h-14">
            <IconLoader2 className="h-10 w-10 animate-spin" />
          </div>
        </Dialog>
      </>
    );
  }
}
