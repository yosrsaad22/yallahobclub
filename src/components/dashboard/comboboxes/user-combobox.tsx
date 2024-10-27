'use client';
import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem, CommandInput, CommandList, CommandEmpty } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { IconCaretUpDown, IconCheck, IconLoader2, IconUser } from '@tabler/icons-react';
import { colorOptions, colorHexMap, MEDIA_HOSTNAME } from '@/lib/constants';
import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTableUser } from '@/types';

interface UserComboboxProps {
  users: DataTableUser[];
  selectedUserId: string | undefined;
  onSelectUser: (userId: string) => void;
  placeholder: string;
  loading: boolean;
}

export function UserCombobox({ users, selectedUserId, onSelectUser, placeholder, loading }: UserComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [buttonWidth, setButtonWidth] = React.useState(0);
  const t = useTranslations('dashboard.tables');
  const tText = useTranslations('dashboard.text');

  React.useEffect(() => {
    if (buttonRef.current) {
      const width = buttonRef.current.getBoundingClientRect().width;
      setButtonWidth(width);
    }
  }, []);

  const handleSelectUser = (userId: string) => {
    onSelectUser(userId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={buttonRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between px-3 font-normal">
          {selectedUserId ? (
            (() => {
              const selectedUser = users.find((user) => user.id === selectedUserId);
              return (
                <div className="flex flex-row items-center gap-x-4">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage
                      className="object-cover"
                      src={`${MEDIA_HOSTNAME}${selectedUser?.image}`}
                      alt={selectedUser?.fullName ?? ''}
                    />
                    <AvatarFallback className="text-md">
                      <IconUser className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  {selectedUser?.fullName}
                </div>
              );
            })()
          ) : (
            <p className="text-muted-foreground">{placeholder}</p>
          )}
          <IconCaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent style={{ width: buttonWidth }} className="p-0">
        <Command>
          <CommandInput placeholder={t('search')} className="h-9" />
          {loading ? (
            <div className="flex justify-center p-4">
              <IconLoader2 className="animate-spin" />
            </div>
          ) : (
            <>
              {users.length === 0 || users === undefined ? (
                <div className="mx-auto bg-background py-4 text-sm hover:bg-background">{t('no-result')}</div>
              ) : (
                <CommandGroup className="overflow-y-auto">
                  <CommandList className="custom-scrollbar max-h-64 overflow-y-auto">
                    {users.map((user: DataTableUser) => (
                      <CommandItem
                        key={user.id}
                        value={user.id}
                        className="flex items-center gap-2"
                        onSelect={() => handleSelectUser(user.id)}>
                        <div className="flex flex-row items-center gap-x-4">
                          <Avatar className="h-9 w-9 border border-border">
                            <AvatarImage
                              className="object-cover"
                              src={`${MEDIA_HOSTNAME}${user.image}`}
                              alt={user?.fullName ?? ''}
                            />
                            <AvatarFallback className="text-md">
                              <IconUser className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          {user.fullName}
                        </div>
                        {selectedUserId === user.id && <IconCheck className="ml-auto h-4 w-4 opacity-100" />}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              )}
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
