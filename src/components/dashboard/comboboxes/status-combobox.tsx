'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Command, CommandInput, CommandList, CommandItem, CommandGroup } from '@/components/ui/command';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { IconCheck, IconCaretUpDown, IconLoader2 } from '@tabler/icons-react';
import { orderStatuses } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface StatusComboboxProps {
  statuses: Array<{ value: string }>;
  placeholder: string;
  selectedStatuses: string[];
  onSelectStatus: (selected: string[]) => void; // Add the loading prop
}

export function StatusCombobox({ statuses, onSelectStatus, selectedStatuses, placeholder }: StatusComboboxProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations('dashboard.tables');
  const tFields = useTranslations('fields');
  const [buttonWidth, setButtonWidth] = useState(0);
  const tStatuses = useTranslations('dashboard.order-statuses');

  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      onSelectStatus(selectedStatuses.filter((s) => s !== status));
    } else {
      onSelectStatus([...selectedStatuses, status]);
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
          aria-expanded={open}
          className="w-full max-w-[90%] justify-between truncate px-3 font-normal text-muted-foreground">
          {placeholder}
          <IconCaretUpDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent style={{ width: buttonWidth }} className="p-0">
        <Command>
          <CommandInput placeholder={t('search')} className="h-9" />

          {statuses.length === 0 || statuses === undefined ? (
            <div className="mx-auto bg-background py-4 text-sm hover:bg-background">{t('no-result')}</div>
          ) : (
            <CommandGroup className="overflow-y-auto">
              <CommandList className="custom-scrollbar max-h-64 overflow-y-auto">
                {statuses.map((status) => (
                  <CommandItem
                    key={status.value}
                    onSelect={() => toggleStatus(status.value)}
                    className="flex items-center">
                    <span className={cn(' px-3 py-1')}>{tStatuses(status.value)}</span>
                    {selectedStatuses.includes(status.value) && (
                      <IconCheck className="ml-auto h-4 w-4 text-foreground" />
                    )}
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
