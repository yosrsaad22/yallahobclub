'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Command, CommandGroup, CommandItem, CommandInput, CommandList, CommandEmpty } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { IconCaretUpDown, IconCheck, IconLoader2, IconUser } from '@tabler/icons-react';
import { MEDIA_HOSTNAME } from '@/lib/constants';
import { useTranslations } from 'next-intl';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DataTableUser } from '@/types';
import { cn } from '@/lib/utils';

interface UserComboboxProps {
  users: DataTableUser[];
  selectedUserId: string | undefined;
  onSelectUser: (userId: string) => void;
  placeholder: string;
  loading: boolean;
}

export function UserCombobox({ users, selectedUserId, onSelectUser, placeholder, loading }: UserComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<DataTableUser[]>(users);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = useTranslations('dashboard.tables');

  // Update filtered users based on search term
  useEffect(() => {
    const lowercasedTerm = searchTerm.trim().toLowerCase();
    if (!lowercasedTerm) {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter((user) => user.fullName.toLowerCase().includes(lowercasedTerm)));
    }
  }, [searchTerm, users]);

  // Close dropdown on clicks outside the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus input field when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Select a user and close dropdown
  const handleSelectUser = (userId: string) => {
    onSelectUser(userId);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <Button
        ref={buttonRef}
        variant="outline"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={(event) => {
          event.preventDefault(); // Prevent form submission
          setIsOpen((prev) => !prev);
        }}
        className="w-full justify-between px-3 font-normal">
        {selectedUserId ? (
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
              <span>{placeholder}</span>
            );
          })()
        ) : (
          <p className="text-muted-foreground">{placeholder}</p>
        )}
        <IconCaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {isOpen && (
        <div
          className="absolute z-50 mt-1 w-full rounded-md border bg-background shadow-lg"
          role="listbox"
          aria-labelledby="user-combobox-button">
          <Command>
            <CommandInput
              ref={inputRef}
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
                        selectedUserId === user.id ? 'bg-muted' : '',
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
                      {selectedUserId === user.id && <IconCheck className="ml-auto h-4 w-4 text-foreground" />}
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
