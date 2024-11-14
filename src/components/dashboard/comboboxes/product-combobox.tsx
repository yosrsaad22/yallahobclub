import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { IconCaretUpDown } from '@tabler/icons-react';
import { Product } from '@prisma/client';
import { MediaType, OrderProduct } from '@/types';
import Image from 'next/image';
import { MEDIA_HOSTNAME } from '@/lib/constants';
import { useTranslations } from 'next-intl';
import { IconLoader2 } from '@tabler/icons-react';

interface ProductComboboxProps {
  products: (Product & { media: MediaType[] })[];
  onSelectProduct: (product: OrderProduct) => void;
  placeholder: string;
  loading: boolean; // Add the loading prop
}

export function ProductCombobox({ products, onSelectProduct, placeholder, loading }: ProductComboboxProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations('dashboard.tables');
  const tFields = useTranslations('fields');
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

  const handleSelectProduct = (product: Product) => {
    const detailPrice = product.wholesalePrice + (product.wholesalePrice * product.profitMargin) / 100;

    const orderProduct: OrderProduct = {
      productId: product.id,
      quantity: '1',
      detailPrice: detailPrice.toString(),
      size: undefined,
      color: undefined,
      supplierProfit: 0,
    };

    onSelectProduct(orderProduct);
    setOpen(false);
  };

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
      <PopoverContent style={{ width: buttonWidth }} className="p-0">
        <Command>
          <CommandInput placeholder={t('search')} className="h-9" />
          {loading ? (
            <div className="flex justify-center p-4">
              <IconLoader2 className="animate-spin" />
            </div>
          ) : (
            <>
              {products.length === 0 || products === undefined ? (
                <div className="mx-auto bg-background py-4 text-sm hover:bg-background">{t('no-result')}</div>
              ) : (
                <CommandGroup className="overflow-y-auto">
                  <CommandList className="custom-scrollbar max-h-64 overflow-y-auto">
                    {products.map((product) => (
                      <CommandItem
                        key={product.id}
                        value={product.name}
                        className="flex h-full min-h-16 flex-col items-center justify-between gap-6 px-6 md:flex-row"
                        onSelect={() => handleSelectProduct(product)}>
                        <div className="flex items-center gap-4">
                          <Image
                            className="rounded-md object-contain"
                            src={`${MEDIA_HOSTNAME}${product.media[0].key}`}
                            alt={product.name}
                            height={50}
                            width={50}
                          />
                          <span>{product.name}</span>
                        </div>
                        <div className="flex flex-row items-center justify-center gap-4">
                          <div className="flex flex-col items-center justify-center gap-1 px-2">
                            <span className="text-sm">{tFields('product-stock')}</span>
                            <span className="font-semibold">{product.stock}</span>
                          </div>
                          <div className="flex flex-col items-center justify-center gap-1">
                            <span className="text-sm">{tFields('product-wholesale-price')}</span>
                            <span className="font-semibold">{product.wholesalePrice} TND</span>
                          </div>

                          <div className="flex flex-col items-center justify-center gap-1">
                            <span className="text-sm">{tFields('product-profit-margin')}</span>
                            <span className="font-semibold">{product.profitMargin}%</span>
                          </div>
                          <div className="flex flex-col items-center justify-center gap-1">
                            <span className="text-sm">{tFields('product-minimum-profit')}</span>
                            <span className="font-semibold text-primary">
                              {(product.wholesalePrice * product.profitMargin) / 100} TND
                            </span>
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              )}
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
