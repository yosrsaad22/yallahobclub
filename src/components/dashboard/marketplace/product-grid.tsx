'use client';

import { useCurrentRole } from '@/hooks/use-current-role';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { ProductCard } from '../cards/product-card';
import { productCategoryOptions, colorHexMap } from '@/lib/constants';
import { Product } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/actions/products';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  IconArrowsSort,
  IconCategory2,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheckFilled,
  IconColorFilter,
  IconFilter,
  IconFilterOff,
  IconLoader2,
  IconSearch,
  IconStar,
  IconTruckLoading,
} from '@tabler/icons-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { DataTableUser, MediaType } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Combobox } from '@/components/ui/combobox';

export default function ProductGrid() {
  const tMarketplace = useTranslations('dashboard.marketplace');
  const tColors = useTranslations('dashboard.colors');

  const tFields = useTranslations('fields');
  const role = useCurrentRole();
  const params = useSearchParams();
  const category = params.get('category') ?? '';
  const search = params.get('search') ?? '';
  const stockFilter = params.get('stock') ?? '';
  const colorsFilter = params.get('colors')?.split(',') ?? [];
  const featuredFilter = params.get('featured') ?? '';
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 30;
  const [selectedColors, setSelectedColors] = useState<string[]>(colorsFilter);
  const [sortOrder, setSortOrder] = useState<string>('newest');
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(featuredFilter === 'true');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [containerHeight, setContainerHeight] = useState<number | 'auto'>('auto');
  const containerRef = useRef<HTMLDivElement>(null);
  const sortArray = [
    { value: 'newest', label: tMarketplace('sort-newest') },
    { value: 'oldest', label: tMarketplace('sort-oldest') },
    { value: 'priceLowToHigh', label: tMarketplace('price-asc') },
    { value: 'priceHighToLow', label: tMarketplace('price-desc') },
    { value: 'stockLowToHigh', label: tMarketplace('stock-asc') },
    { value: 'stockHighToLow', label: tMarketplace('stock-desc') },
  ];

  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await getProducts();
      if (res.error) throw new Error(res.error);
      if (res.success)
        return res.data.filter(
          (product: Product & { media: MediaType[]; sellers: DataTableUser[]; supplierCode: string }) =>
            product.published,
        );
    },
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    const newParams = new URLSearchParams(window.location.search);
    if (searchValue) {
      newParams.set('search', searchValue);
    } else {
      newParams.delete('search');
    }
    const newUrl = `${window.location.pathname}?${newParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  const handleCategoryClick = (category: string) => {
    const newParams = new URLSearchParams(window.location.search);
    if (newParams.get('category') === category) {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    const newUrl = `${window.location.pathname}?${newParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  const handleStockClick = (stockStatus: string) => {
    const newParams = new URLSearchParams(window.location.search);
    if (newParams.get('stock') === stockStatus) {
      newParams.delete('stock');
    } else {
      newParams.set('stock', stockStatus);
    }
    const newUrl = `${window.location.pathname}?${newParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  const handleFeaturedClick = () => {
    const newFeaturedStatus = !featuredOnly;
    setFeaturedOnly(newFeaturedStatus);

    const newParams = new URLSearchParams(window.location.search);
    newFeaturedStatus ? newParams.set('featured', 'true') : newParams.delete('featured');
    window.history.replaceState({}, '', `${window.location.pathname}?${newParams}`);
  };

  const handleColorSelect = (color: string) => {
    const newColors = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];

    setSelectedColors(newColors);

    const newParams = new URLSearchParams(window.location.search);
    if (newColors.length > 0) {
      newParams.set('colors', newColors.join(','));
    } else {
      newParams.delete('colors');
    }
    const newUrl = `${window.location.pathname}?${newParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  const handleSortChange = (order: string) => {
    setSortOrder(order);
  };

  const filtered = useMemo(() => {
    if (data) {
      let result = data;

      if (category) {
        result = result.filter((product: Product) => product.category === category.toUpperCase());
      }

      if (search) {
        result = result.filter(
          (product: Product & { supplierCode: string }) =>
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.supplierCode.toLowerCase().includes(search.toLowerCase()),
        );
      }

      if (stockFilter === 'in') {
        result = result.filter((product: Product) => product.stock > 0);
      } else if (stockFilter === 'out') {
        result = result.filter((product: Product) => product.stock === 0);
      }

      if (featuredOnly) {
        result = result.filter((product: Product) => product.featured);
      }

      if (selectedColors.length > 0) {
        result = result.filter((product: Product) =>
          product.colors.some((color) => selectedColors.includes(color as string)),
        );
      }

      return result.sort((a: Product, b: Product) => {
        switch (sortOrder) {
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'priceLowToHigh':
            return a.wholesalePrice - b.wholesalePrice;
          case 'priceHighToLow':
            return b.wholesalePrice - a.wholesalePrice;
          case 'stockLowToHigh':
            return a.stock - b.stock;
          case 'stockHighToLow':
            return b.stock - a.stock;
          default:
            return 0;
        }
      });
    }
    return [];
  }, [category, search, stockFilter, selectedColors, data, sortOrder, featuredOnly]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const toggleFilters = () => {
    if (showAdvancedFilters && containerRef.current) {
      // Measure the height before hiding
      setContainerHeight(containerRef.current.offsetHeight);
    }
    setShowAdvancedFilters((prev) => !prev);
  };

  useEffect(() => {
    if (showAdvancedFilters) {
      // Reset height to auto when shown
      setContainerHeight('auto');
    }
  }, [showAdvancedFilters]);

  return (
    <div className="flex h-full w-full animate-fade-in flex-col gap-x-4 gap-y-4 ">
      <div className="flex w-full flex-col items-center justify-start space-y-4">
        <div className="flex w-full flex-row gap-2">
          <div className="relative w-full">
            <Input
              className="h-11 pl-12 text-sm"
              placeholder={tMarketplace('search')}
              value={search}
              onChange={handleSearchChange}
            />
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
          </div>
          <Button
            className="px-3"
            variant={showAdvancedFilters ? 'destructive' : 'outline'}
            size={'default'}
            onClick={() => {
              if (showAdvancedFilters) {
                // Remove all filters
                setSelectedColors([]);
                setSortOrder('newest');
                setFeaturedOnly(false);
                const newParams = new URLSearchParams(window.location.search);
                newParams.delete('category');
                newParams.delete('search');
                newParams.delete('stock');
                newParams.delete('colors');
                newParams.delete('featured');
                window.history.replaceState({}, '', `${window.location.pathname}?${newParams}`);
              }
              toggleFilters();
            }}>
            {showAdvancedFilters ? (
              <>
                <IconFilterOff className="mr-2 h-5 w-5" />
                {tMarketplace('clear')}
              </>
            ) : (
              <>
                <IconFilter className="mr-2 h-5 w-5" />
                {tMarketplace('filter')}
              </>
            )}
          </Button>
        </div>
        <motion.div
          style={{ height: containerHeight, width: '100%' }}
          animate={{ height: showAdvancedFilters ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}>
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                key="advanced-filters"
                ref={containerRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}>
                <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-5">
                  <div className="flex flex-col gap-2">
                    <Combobox
                      showSearch={false}
                      items={[{ value: 'featured', label: tMarketplace('featured') }]}
                      selectedItems={featuredOnly ? [{ value: 'featured', label: tMarketplace('featured') }] : []}
                      onSelect={(item) => handleFeaturedClick()}
                      displayValue={(item) => item.label}
                      itemKey={(item) => item.value}
                      placeholder={tMarketplace('featured')}
                    />
                    {featuredOnly && (
                      <p className="pl-2 text-sm text-muted-foreground">1 {tMarketplace('filters-applied')}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Combobox
                      items={sortArray}
                      selectedItems={sortArray.filter((item) => item.value === sortOrder)}
                      placeholder={tMarketplace('sort')}
                      itemKey={(item) => item.value}
                      onSelect={(item) => handleSortChange(item.value)}
                      displayValue={(item) => item.label}
                    />
                    {sortOrder !== 'newest' && (
                      <p className="pl-2 text-xs text-muted-foreground">1 {tMarketplace('filters-applied')}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Combobox
                      items={Object.values(productCategoryOptions).map((cat) => ({
                        value: cat,
                        label: tFields(`category-${cat.toLowerCase()}`),
                      }))}
                      selectedItems={
                        category
                          ? [
                              {
                                value: category,
                                label: tFields(`category-${category.toLowerCase()}`),
                              },
                            ]
                          : []
                      }
                      onSelect={(item) => handleCategoryClick(item.value)}
                      displayValue={(item) => item.label}
                      itemKey={(item) => item.value}
                      placeholder={tMarketplace('categories')}
                    />
                    {category && (
                      <p className="pl-2 text-xs text-muted-foreground">1 {tMarketplace('filters-applied')}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Combobox
                      items={[
                        { value: 'in', label: tFields('in-stock') },
                        { value: 'out', label: tFields('out-of-stock') },
                      ]}
                      selectedItems={
                        stockFilter
                          ? [
                              {
                                value: stockFilter,
                                label: tFields(stockFilter === 'in' ? 'in-stock' : 'out-of-stock'),
                              },
                            ]
                          : []
                      }
                      onSelect={(item) => handleStockClick(item.value)}
                      displayValue={(item) => item.label}
                      itemKey={(item) => item.value}
                      placeholder={tMarketplace('stock')}
                    />
                    {stockFilter && (
                      <p className="pl-2 text-xs text-muted-foreground">1 {tMarketplace('filters-applied')}</p>
                    )}
                  </div>
                  <div className="col-span-2 flex flex-col gap-2 md:col-span-1">
                    <Combobox
                      items={Object.keys(colorHexMap).map((color) => ({
                        value: color,
                        label: color,
                      }))}
                      selectedItems={selectedColors.map((color) => ({
                        value: color,
                        label: color,
                      }))}
                      onSelect={(item) => handleColorSelect(item.value)}
                      displayValue={(item) => tColors(item.value)}
                      itemKey={(item) => item.value}
                      placeholder={tMarketplace('colors')}
                    />
                    {selectedColors.length > 0 && (
                      <p className="pl-2 text-xs text-muted-foreground">
                        {selectedColors.length} {tMarketplace('filters-applied')}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <div className="grid w-full grid-cols-2  gap-4  rounded-md md:grid-cols-3 lg:grid-cols-5">
          {isLoading ? (
            <div className="col-span-2 flex  h-full w-full items-center justify-center py-24 text-center text-primary md:col-span-4">
              <IconLoader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : currentItems.length > 0 ? (
            currentItems.map((product: Product & { media: MediaType[]; sellers: DataTableUser[] }) => (
              <ProductCard
                id={product.id}
                imageHeight={180}
                imageWidth={180}
                profitMargin={product.profitMargin}
                key={product.code}
                sellers={product.sellers}
                image={product.media[0].key}
                name={product.name}
                wholesalePrice={product.wholesalePrice}
                category={product.category as productCategoryOptions}
                stock={product.stock}
                colors={product.colors}
                supplierCode={product.supplierCode}
              />
            ))
          ) : (
            <p className="col-span-2 h-full py-24 text-center text-sm text-muted-foreground md:col-span-4">
              {tMarketplace('no-results')}
            </p>
          )}
        </div>
        <div className="flex w-full items-center justify-between">
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            variant="outline"
            size={'sm'}
            className="flex items-center gap-1">
            <IconChevronLeft />
            {tMarketplace('previous')}
          </Button>
          <p className="text-sm text-muted-foreground">
            page {currentPage} {tMarketplace('of')} {totalPages}
          </p>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            variant="outline"
            size={'sm'}
            className="flex items-center gap-1">
            {tMarketplace('next')}
            <IconChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
