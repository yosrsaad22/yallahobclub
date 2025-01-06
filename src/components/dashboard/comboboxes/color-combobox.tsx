'use client';
import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem, CommandInput, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { IconCaretUpDown } from '@tabler/icons-react';
import { colorOptions, colorHexMap } from '@/lib/constants';
import { useTranslations } from 'next-intl';

interface ColorPickerComboboxProps {
  colors: string[];
  selectedColor: string | undefined;
  onSelectColor: (color: string) => void;
  placeholder: string;
}

export function ColorPickerCombobox({ colors, selectedColor, onSelectColor, placeholder }: ColorPickerComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [buttonWidth, setButtonWidth] = React.useState(0);
  const tColors = useTranslations('dashboard.colors');
  const t = useTranslations('dashboard.tables');
  const tText = useTranslations('dashboard.text');

  React.useEffect(() => {
    if (buttonRef.current) {
      const width = buttonRef.current.getBoundingClientRect().width;
      setButtonWidth(width);
    }
  }, []);

  const handleSelectColor = (color: string) => {
    onSelectColor(color);
    //setOpen(false);
  };

  const isColorsEmpty = colors.length === 0;
  const displayPlaceholder = isColorsEmpty ? tText('product-no-attribute') : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {isColorsEmpty ? (
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
            {selectedColor ? (
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-4 w-4 rounded-full border border-border"
                  style={{ backgroundColor: colorHexMap[selectedColor as keyof typeof colorHexMap] }}
                />
                {tColors(selectedColor)}
              </div>
            ) : (
              <p className="text-muted-foreground">{placeholder}</p>
            )}
            <IconCaretUpDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground opacity-50" />
          </Button>
        </PopoverTrigger>
      )}

      <PopoverContent style={{ width: buttonWidth }} className="p-0">
        <Command>
          <CommandInput placeholder={t('search')} className="h-9" />
          <CommandList className="custom-scrollbar max-h-64 overflow-y-auto">
            <CommandGroup>
              {colors.map((color) => (
                <CommandItem
                  key={color}
                  value={color}
                  className="flex items-center gap-2"
                  onSelect={() => handleSelectColor(color)}>
                  <span
                    className="inline-block h-4 w-4 rounded-full border border-border"
                    style={{ backgroundColor: colorHexMap[color as keyof typeof colorHexMap] }}
                  />
                  {tColors(color)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
