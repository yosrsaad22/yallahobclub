import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IconCaretUpDown, IconCheck } from '@tabler/icons-react';

interface ComboboxProps<T> {
  items: T[];
  selectedItems?: T[] | T; // Accept either an array or a single item
  multiSelect?: boolean; // Add the multiSelect prop
  onSelect: (item: T) => void;
  placeholder: string;
  displayValue: (item: T) => string;
  itemKey: (item: T) => string;
  isDark?: boolean;
  showSearch?: boolean;
}

export function Combobox<T>({
  items,
  selectedItems,
  multiSelect = true,
  onSelect,
  placeholder,
  displayValue,
  itemKey,
  showSearch = true,
  isDark = false,
}: ComboboxProps<T>) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonWidth, setButtonWidth] = useState(0);

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
          <Button
            ref={buttonRef}
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between px-3 font-normal text-muted-foreground">
            {Array.isArray(selectedItems) ? (
              <p className="max-w-[90%] truncate">{placeholder}</p>
            ) : (
              <div className="max-w-full overflow-hidden truncate text-ellipsis whitespace-nowrap">
                {selectedItems ? (
                  <span className="text-foreground">{displayValue(selectedItems as T)}</span>
                ) : (
                  <p className="max-w-[90%] truncate">{placeholder}</p>
                )}
              </div>
            )}
            <IconCaretUpDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground opacity-50" />
          </Button>
        ) : (
          <Button
            ref={buttonRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between px-3 font-normal text-muted-foreground">
            {Array.isArray(selectedItems) ? (
              <p className="max-w-[90%] truncate">{placeholder}</p>
            ) : (
              <div>
                {selectedItems ? (
                  <span className="text-foreground">{displayValue(selectedItems as T)}</span>
                ) : (
                  <p className="max-w-[90%] truncate">{placeholder}</p>
                )}
              </div>
            )}
            <IconCaretUpDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground opacity-50" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        style={{ width: buttonRef.current ? buttonRef.current.offsetWidth : 'auto' }}
        className={`${isDark ? 'border-[#9ca3af] bg-[#1f2937] text-[#9ca3af]' : ''} p-0`}>
        <Command className={`${isDark ? 'border-[#9ca3af] bg-[#1f2937] text-[#9ca3af]' : ''}`}>
          {showSearch && <CommandInput placeholder="Rechercher" className="h-9" />}
          <CommandEmpty>Pas de résultat</CommandEmpty>
          <CommandGroup className="overflow-y-auto">
            <CommandList className="custom-scrollbar max-h-64 overflow-y-auto">
              {items.length > 0 &&
                items.map((item) => (
                  <CommandItem
                    key={itemKey(item)}
                    className={`${isDark ? 'text-white' : ''} w-full`}
                    onSelect={() => {
                      onSelect(item);
                      if (!multiSelect) {
                        setOpen(false);
                      }
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
