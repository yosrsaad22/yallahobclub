'use client';

import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem, CommandInput, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { IconCaretUpDown } from '@tabler/icons-react';
import { sizeOptions } from '@/lib/constants';
import { useTranslations } from 'next-intl';

interface SizePickerComboboxProps {
  selectedSize: string | undefined;
  onSelectSize: (size: string) => void;
  sizes: string[];
  placeholder: string;
}

export function SizePickerCombobox({ selectedSize, onSelectSize, sizes, placeholder }: SizePickerComboboxProps) {
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

  const handleSelectSize = (size: string) => {
    onSelectSize(size);
    //setOpen(false);
  };

  const isSizesEmpty = sizes.length === 0;
  const displayPlaceholder = isSizesEmpty ? tText('product-no-attribute') : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {isSizesEmpty ? (
        <Button
          ref={buttonRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between px-3 font-normal text-muted-foreground"
          disabled>
          {displayPlaceholder}
        </Button>
      ) : (
        <PopoverTrigger asChild>
          <Button
            ref={buttonRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between px-3 font-normal">
            {selectedSize ? selectedSize : <p className="text-muted-foreground">{placeholder}</p>}
            <IconCaretUpDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground opacity-50" />
          </Button>
        </PopoverTrigger>
      )}
      {!isSizesEmpty && (
        <PopoverContent style={{ width: buttonWidth }} className="p-0">
          <Command>
            <CommandInput placeholder={t('search')} className="h-9" />
            <CommandList className="custom-scrollbar max-h-64 overflow-y-auto">
              <CommandGroup>
                {sizes.map((size) => (
                  <CommandItem key={size} value={size} onSelect={() => handleSelectSize(size)}>
                    {size}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
}
