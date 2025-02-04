import React, { useEffect, useRef, useState } from 'react';
import { Command, CommandGroup, CommandItem, CommandInput, CommandList, CommandEmpty } from '@/components/ui/command';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { IconCaretUpDown, IconCheck, IconLoader2, IconPackage } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { MEDIA_HOSTNAME } from '@/lib/constants';
import Image from 'next/image';
import { MediaType } from '@/types';
import { Product } from '@prisma/client';

interface ProductFilterComboboxProps {
  products: (Product & { media: MediaType[] })[];
  selectedProductIds?: string[];
  selectedProductId?: string;
  onSelectProducts?: (productIds: string[]) => void;
  onSelectProduct?: (productId: string) => void;
  placeholder: string;
  loading: boolean;
  multiSelect?: boolean;
}

export function ProductFilterCombobox({
  products,
  selectedProductIds = [],
  selectedProductId,
  onSelectProducts,
  onSelectProduct,
  placeholder,
  loading,
  multiSelect = false,
}: ProductFilterComboboxProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<(Product & { media: MediaType[] })[]>(products);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonWidth, setButtonWidth] = useState(0);
  const [open, setOpen] = useState(false);

  // Update filtered products based on search term
  useEffect(() => {
    const lowercasedTerm = searchTerm.trim().toLowerCase();
    setFilteredProducts(
      lowercasedTerm ? products.filter((product) => product.name.toLowerCase().includes(lowercasedTerm)) : products,
    );
  }, [searchTerm, products]);

  const handleSelectProduct = (productId: string) => {
    if (multiSelect) {
      const updatedSelectedIds = selectedProductIds.includes(productId)
        ? selectedProductIds.filter((id) => id !== productId)
        : [...selectedProductIds, productId];
      onSelectProducts?.(updatedSelectedIds);
    } else {
      onSelectProduct?.(productId);
      setOpen(false);
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
          aria-expanded={false}
          className="w-full justify-between px-3 font-normal">
          {multiSelect ? (
            <p className="max-w-[90%] truncate text-muted-foreground">{placeholder}</p>
          ) : selectedProductId ? (
            (() => {
              const selectedProduct = products.find((product) => product.id === selectedProductId);
              return selectedProduct ? (
                <div className="flex flex-row items-center gap-x-3">
                  <Image
                    className="rounded-md object-contain"
                    src={`${MEDIA_HOSTNAME}${selectedProduct.media[0].key}`}
                    alt={selectedProduct.name}
                    width={32}
                    height={32}
                  />
                  <span>{selectedProduct.name}</span>
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
      </PopoverTrigger>
      <PopoverContent style={{ width: buttonWidth }} className="p-0">
        <Command>
          <CommandInput
            placeholder="Search products"
            className="h-10 w-full"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          {loading ? (
            <div className="flex justify-center p-4">
              <IconLoader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <CommandList className="custom-scrollbar max-h-36 overflow-y-auto">
              <CommandGroup>
                {filteredProducts.map((product) => (
                  <CommandItem
                    key={product.id}
                    onSelect={() => handleSelectProduct(product.id)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2 hover:bg-muted focus:bg-muted',
                      multiSelect
                        ? selectedProductIds.includes(product.id) && 'bg-muted'
                        : selectedProductId === product.id && 'bg-muted',
                    )}>
                    <Image
                      className="rounded-md object-contain"
                      src={`${MEDIA_HOSTNAME}${product.media[0].key}`}
                      alt={product.name}
                      width={48}
                      height={48}
                    />
                    <span className="text-sm">{product.name}</span>
                    {(multiSelect ? selectedProductIds.includes(product.id) : selectedProductId === product.id) && (
                      <IconCheck className="ml-auto h-4 w-4 text-foreground" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          ) : (
            <CommandEmpty className="p-4 text-sm text-muted-foreground">No results found</CommandEmpty>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
