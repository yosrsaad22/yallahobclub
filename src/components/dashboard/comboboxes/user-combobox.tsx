'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Command, CommandGroup, CommandItem, CommandInput, CommandList, CommandEmpty } from '@/components/ui/command';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { IconCaretUpDown, IconCheck, IconLoader2, IconUser } from '@tabler/icons-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { DataTableUser } from '@/types';
import { useTranslations } from 'next-intl';
import { MEDIA_HOSTNAME } from '@/lib/constants';

interface UserComboboxProps {
  users: DataTableUser[];
  selectedUserIds?: string[];
  selectedUserId?: string;
  onSelectUsers?: (userIds: string[]) => void;
  onSelectUser?: (userId: string) => void;
  placeholder: string;
  loading: boolean;
  multiSelect?: boolean;
}

export function UserCombobox({
  users,
  selectedUserIds = [],
  selectedUserId,
  onSelectUsers,
  onSelectUser,
  placeholder,
  loading,
  multiSelect = false,
}: UserComboboxProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<DataTableUser[]>(users);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonWidth, setButtonWidth] = useState(0);
  const [open, setOpen] = useState(false);

  const t = useTranslations('dashboard.tables');

  // Update filtered users based on search term
  useEffect(() => {
    const lowercasedTerm = searchTerm.trim().toLowerCase();
    setFilteredUsers(
      lowercasedTerm ? users.filter((user) => user.fullName.toLowerCase().includes(lowercasedTerm)) : users,
    );
  }, [searchTerm, users]);

  const handleSelectUser = (userId: string) => {
    if (multiSelect) {
      const updatedSelectedIds = selectedUserIds.includes(userId)
        ? selectedUserIds.filter((id) => id !== userId)
        : [...selectedUserIds, userId];
      onSelectUsers?.(updatedSelectedIds);
    } else {
      onSelectUser?.(userId);
      setOpen(false);
    }
  };

  useEffect(() => {
    if (buttonRef.current) {
      const width = buttonRef.current.getBoundingClientRect().width;
      setButtonWidth(width);
    }

    const handleResize = () => {
      if (buttonRef.current) {
        const width = buttonRef.current.getBoundingClientRect().width;
        setButtonWidth(width);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={buttonRef}
          variant="outline"
          role="combobox"
          aria-expanded={false}
          className="w-full justify-between px-3 font-normal">
          {multiSelect ? (
            selectedUserIds.length > 0 ? (
              `${selectedUserIds.length} selected`
            ) : (
              <p className="text-muted-foreground">{placeholder}</p>
            )
          ) : selectedUserId ? (
            (() => {
              const selectedUser = users.find((user) => user.id === selectedUserId);
              return selectedUser ? (
                <div className="flex flex-row items-center gap-x-3">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage
                      className="object-cover"
                      src={`${MEDIA_HOSTNAME}${selectedUser.image}`}
                      alt={selectedUser.fullName}
                    />{' '}
                    <AvatarFallback>
                      <IconUser className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <span>{selectedUser.fullName}</span>
                </div>
              ) : (
                <span>{placeholder}</span>
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
          <CommandInput
            placeholder={t('search')}
            className="h-10 w-full"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          {loading ? (
            <div className="flex justify-center p-4">
              <IconLoader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : filteredUsers.length > 0 ? (
            <CommandList className="custom-scrollbar max-h-36 overflow-y-auto">
              <CommandGroup>
                {filteredUsers.map((user) => (
                  <CommandItem
                    key={user.id}
                    onSelect={() => handleSelectUser(user.id)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2 hover:bg-muted focus:bg-muted',
                      multiSelect
                        ? selectedUserIds.includes(user.id) && 'bg-muted'
                        : selectedUserId === user.id && 'bg-muted',
                    )}>
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarImage
                        className="object-cover"
                        src={`${MEDIA_HOSTNAME}${user.image}`}
                        alt={user.fullName}
                      />
                      <AvatarFallback>
                        <IconUser className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{user.fullName}</span>
                    {(multiSelect ? selectedUserIds.includes(user.id) : selectedUserId === user.id) && (
                      <IconCheck className="ml-auto h-4 w-4 text-foreground" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          ) : (
            <CommandEmpty className="p-4 text-sm text-muted-foreground">{t('no-result')}</CommandEmpty>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
