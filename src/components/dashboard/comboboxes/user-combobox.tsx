'use client';

import * as React from 'react';
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
  const [isOpen, setIsOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const t = useTranslations('dashboard.tables');

  // Filter users based on search term
  React.useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      setFilteredUsers(users.filter((user) => user.fullName.toLowerCase().includes(lowercasedTerm)));
    }
  }, [searchTerm, users]);

  const [filteredUsers, setFilteredUsers] = React.useState<DataTableUser[]>(users);

  // Handle clicks outside the combobox to close the dropdown
  React.useEffect(() => {
    function handleClickOutside(event: Event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Focus the input when dropdown opens
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault(); // Only prevent default for 'Escape'
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  // Handle selecting a user
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
          event.preventDefault(); // Prevent default if button is inside a form
          setIsOpen((prev) => !prev);
        }}
        className="w-full justify-between px-3 font-normal">
        {selectedUserId ? (
          (() => {
            const selectedUser = users.find((user) => user.id === selectedUserId);
            return (
              <div className="flex flex-row items-center gap-x-3">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage
                    className="object-cover"
                    src={`${MEDIA_HOSTNAME}${selectedUser?.image}`}
                    alt={selectedUser?.fullName ?? ''}
                  />
                  <AvatarFallback className="text-md">
                    <IconUser className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <span>{selectedUser?.fullName}</span>
              </div>
            );
          })()
        ) : (
          <p className="text-muted-foreground">{placeholder}</p>
        )}
        <IconCaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute z-50 mt-1 w-full rounded-md border bg-background shadow-lg"
          role="listbox"
          aria-labelledby="user-combobox-button"
          onKeyDown={handleKeyDown}>
          <Command>
            {/* CommandInput Wrapper */}
            <div className="flex h-full  w-full cursor-text " onClick={() => inputRef.current?.focus()}>
              <CommandInput
                ref={inputRef}
                placeholder={t('search')}
                className="h-10 w-full flex-1 "
                aria-label={t('search-users')}
                value={searchTerm}
                onValueChange={(value) => setSearchTerm(value)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const firstItem = dropdownRef.current?.querySelector('[role="option"]') as HTMLElement;
                    firstItem?.focus();
                  }
                }}
              />
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center p-4">
                <IconLoader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {/* No Results State */}
                {filteredUsers.length === 0 ? (
                  <CommandEmpty className="mx-auto bg-background py-4 text-sm text-muted-foreground">
                    {t('no-result')}
                  </CommandEmpty>
                ) : (
                  <CommandList className="custom-scrollbar max-h-36 overflow-y-auto">
                    <CommandGroup>
                      {filteredUsers.map((user: DataTableUser) => (
                        <CommandItem
                          key={user.id}
                          value={user.id}
                          onSelect={() => handleSelectUser(user.id)}
                          className={cn(
                            'flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-muted focus:bg-muted focus:outline-none',
                            selectedUserId === user.id ? 'bg-muted' : '',
                          )}
                          role="option"
                          aria-selected={selectedUserId === user.id}>
                          <Avatar className="h-8 w-8 border border-border">
                            <AvatarImage
                              className="object-cover"
                              src={`${MEDIA_HOSTNAME}${user.image}`}
                              alt={user?.fullName ?? ''}
                            />
                            <AvatarFallback className="text-md">
                              <IconUser className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-normal">{user.fullName}</span>
                          {selectedUserId === user.id && <IconCheck className="ml-auto h-4 w-4 text-foreground" />}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                )}
              </>
            )}
          </Command>
        </div>
      )}
    </div>
  );
}
