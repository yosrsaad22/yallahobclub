import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IconCaretUpDown, IconCheck } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { AceternityButton } from './aceternity-button';

interface ComboboxProps<T> {
  items: T[];
  selectedItems?: T[] | T; // Accept either an array or a single item
  multiSelect?: boolean; // Add the multiSelect prop
  onSelect: (item: T) => void;
  placeholder: string;
  displayValue: (item: T) => string;
  itemKey: (item: T) => string;
  isDark?: boolean;
}

export function Combobox<T>({
  items,
  selectedItems,
  multiSelect = true,
  onSelect,
  placeholder,
  displayValue,
  itemKey,
  isDark = false,
}: ComboboxProps<T>) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonWidth, setButtonWidth] = useState(0);
  const t = useTranslations('dashboard.tables');
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

  const isSelected = (item: T) => {
    if (multiSelect) {
      return (
        Array.isArray(selectedItems) && selectedItems.some((selectedItem) => itemKey(selectedItem) === itemKey(item))
      );
    }
    return selectedItems === item;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {isDark ? (
          <AceternityButton
            ref={buttonRef}
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between px-3 font-normal text-muted-foreground">
            {Array.isArray(selectedItems) ? (
              placeholder
            ) : (
              <div>
                {selectedItems ? (
                  <span className="text-foreground">{displayValue(selectedItems as T)}</span>
                ) : (
                  placeholder
                )}
              </div>
            )}
            <IconCaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </AceternityButton>
        ) : (
          <Button
            ref={buttonRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between px-3 font-normal text-muted-foreground">
            {Array.isArray(selectedItems) ? (
              placeholder
            ) : (
              <div>
                {selectedItems ? (
                  <span className="text-foreground">{displayValue(selectedItems as T)}</span>
                ) : (
                  placeholder
                )}
              </div>
            )}
            <IconCaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent style={{ width: buttonWidth }} className={`${isDark ? 'bg-[#1f2937] text-[#9ca3af]' : ''} p-0`}>
        <Command>
          <CommandInput placeholder={t('search')} className="h-9 " />
          <CommandEmpty>{t('no-result')}</CommandEmpty>
          <CommandGroup className="overflow-y-auto ">
            <CommandList className="custom-scrollbar max-h-64 overflow-y-auto ">
              {items.length !== 0 &&
                items.map((item) => (
                  <CommandItem
                    key={itemKey(item)}
                    value={displayValue(item)}
                    className="w-full"
                    onSelect={() => {
                      onSelect(item);
                      setOpen(false);
                    }}>
                    {displayValue(item)}
                    {isSelected(item) && <IconCheck className="ml-auto h-4 w-4 opacity-100" />}
                  </CommandItem>
                ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
