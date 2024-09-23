import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IconCaretUpDown, IconCheck } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

interface ComboboxProps<T> {
  items: T[];
  selectedItems?: T[];
  onSelect: (item: T) => void;
  placeholder: string;
  displayValue: (item: T) => string;
  itemKey: (item: T) => string;
}

export function Combobox<T>({ items, selectedItems, onSelect, placeholder, displayValue, itemKey }: ComboboxProps<T>) {
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={buttonRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between px-3 font-normal text-muted-foreground">
          {placeholder}
          <IconCaretUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent style={{ width: buttonWidth }} className={` p-0`}>
        <Command>
          <CommandInput placeholder={`${placeholder.toLowerCase()}...`} className="h-9" />
          <CommandEmpty>Aucun élément trouvé.</CommandEmpty>
          <CommandGroup className="overflow-y-auto">
            <CommandList className="custom-scrollbar max-h-64 overflow-y-auto">
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
                    {selectedItems && (
                      <IconCheck
                        className={cn(
                          'ml-auto h-4 w-4',
                          selectedItems.some((selectedItem) => itemKey(selectedItem) === itemKey(item))
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                    )}
                  </CommandItem>
                ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
