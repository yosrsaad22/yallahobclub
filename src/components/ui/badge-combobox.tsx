import * as React from 'react';
import { Combobox } from '@/components/ui/combobox';
import { Badge } from '@/components/ui/badge';
import { IconX } from '@tabler/icons-react';
import { colorHexMap, colorOptions } from '@/lib/constants';

interface BadgeComboboxProps<T> {
  items: T[];
  selectedItems: T[];
  placeholder: string;
  displayValue: (item: T) => string;
  onSelect: (item: T) => void;
  onRemove: (item: T) => void;
  isColorPicker?: boolean;
}

export function BadgeCombobox<T>({
  items,
  selectedItems,
  placeholder,
  displayValue,
  onSelect,
  onRemove,
  isColorPicker = false,
}: BadgeComboboxProps<T>) {
  return (
    <div>
      <Combobox
        items={items}
        selectedItems={selectedItems}
        onSelect={onSelect}
        placeholder={placeholder}
        displayValue={displayValue}
        itemKey={(item) => items.indexOf(item).toString()}
      />
      <div className="mt-2 flex flex-row flex-wrap gap-x-2 gap-y-2">
        {selectedItems.length > 0 &&
          selectedItems.map((item) => (
            <Badge
              variant={'background'}
              key={displayValue(item)}
              className="flex h-8 items-center justify-between space-x-2 text-sm font-normal hover:cursor-pointer"
              onClick={() => onRemove(item)}>
              {isColorPicker && colorHexMap[item as keyof typeof colorHexMap] && (
                <span
                  className="inline-block h-4 w-4 rounded-full border border-border"
                  style={{
                    backgroundColor: colorHexMap[item as keyof typeof colorHexMap],
                  }}></span>
              )}
              <p className="font-medium">{displayValue(item)}</p>
              <IconX className="h-5 w-5"></IconX>
            </Badge>
          ))}
      </div>
    </div>
  );
}
