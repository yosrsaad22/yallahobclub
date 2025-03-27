'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { IconLoader2, IconUser } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useCurrentRole } from '@/hooks/use-current-role';
import { logout } from '@/actions/auth';
import { useState } from 'react';
import { MEDIA_HOSTNAME } from '@/lib/constants';
import { Dialog } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

export function UserNav() {
  const user = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const role = useCurrentRole();

  if (user) {
    return (
      <>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full">
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
            <DropdownMenuGroup className="text-sm">
              <DropdownMenuItem
                onClick={() => {
                  setOpen(false);
                  router.replace(`/dashboard/${role?.toLowerCase()}/settings`);
                }}>
                Paramètres
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
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog
          classname="md:w-[20rem] w-[60%]"
          title={'Déconnexion'}
          showCloseButton={false}
          enableInteractOutside={false}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}>
          <div className="flex h-10 w-full flex-col items-center justify-center md:h-14">
            <IconLoader2 className="h-10 w-10 animate-spin" />
          </div>
        </Dialog>
      </>
    );
  }
}
