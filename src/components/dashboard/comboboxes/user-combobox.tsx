'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Command, CommandGroup, CommandItem, CommandInput, CommandList, CommandEmpty } from '@/components/ui/command';
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
  customContentClassNames?: string;
}

export function UserCombobox({
  users,
  selectedUserIds = [],
  selectedUserId,
  onSelectUsers,
  onSelectUser,
  placeholder,
  customContentClassNames,
  loading,
  multiSelect = false,
}: UserComboboxProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<DataTableUser[]>(users);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const t = useTranslations('dashboard.tables');

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
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div className="w-full" role="combobox" aria-expanded={open}>
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}
          variant="outline"
          className="w-full justify-between px-3 font-normal">
          {multiSelect ? (
            <p className="max-w-[90%] truncate text-muted-foreground">{placeholder}</p>
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
                    />
                    <AvatarFallback>
                      <IconUser className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <span>{selectedUser.fullName}</span>
                </div>
              ) : (
                <span className="max-w-[90%] truncate">{placeholder}</span>
              );
            })()
          ) : (
            <p className="max-w-[90%] truncate text-muted-foreground">{placeholder}</p>
          )}
          <IconCaretUpDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground opacity-50" />
        </Button>
      </div>

      {open && (
        <div
          ref={dropdownRef}
          className={cn('absolute z-10 w-full rounded border border-border shadow-md ', customContentClassNames)}>
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
        </div>
      )}
    </div>
  );
}
