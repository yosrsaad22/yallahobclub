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
import { useMemo, useState } from 'react';
import {
  IconArrowsSort,
  IconCategory2,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheckFilled,
  IconColorFilter,
  IconFilter,
  IconLoader2,
  IconSearch,
  IconStar,
  IconTruckLoading,
} from '@tabler/icons-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { DataTableUser, MediaType } from '@/types';

export default function ProductGrid() {
  const tMarketplace = useTranslations('dashboard.marketplace');
  const tFields = useTranslations('fields');
  const role = useCurrentRole();
  const params = useSearchParams();
  const category = params.get('category') ?? '';
  const search = params.get('search') ?? '';
  const stockFilter = params.get('stock') ?? '';
  const colorsFilter = params.get('colors')?.split(',') ?? [];
  const featuredFilter = params.get('featured') ?? '';
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 16;
  const [selectedColors, setSelectedColors] = useState<string[]>(colorsFilter);
  const [sortOrder, setSortOrder] = useState<string>('newest');
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(featuredFilter === 'true');

  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await getProducts();
      if (res.error) throw new Error(res.error);
      if (res.success)
        return res.data.filter(
          (product: Product & { media: MediaType[]; sellers: DataTableUser[] }) => product.published,
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
    if (newFeaturedStatus) {
      newParams.set('featured', 'true');
    } else {
      newParams.delete('featured');
    }
    const newUrl = `${window.location.pathname}?${newParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
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
        result = result.filter((product: Product) => product.name.toLowerCase().includes(search.toLowerCase()));
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

  return (
    <div className="flex h-full w-full animate-fade-in flex-col gap-x-4 gap-y-4 md:flex-row">
      <div className="hidden h-full w-full  flex-col space-y-0 rounded-md border border-border bg-background p-4 text-foreground/80 md:flex md:w-[25%] md:space-y-4">
        <h2 className="flex flex-row items-center justify-start gap-x-2 pb-0  text-lg font-bold">
          <IconFilter />
          {tMarketplace('filter')}
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {/* Featured Filter */}

          <AccordionItem value="item-4">
            <AccordionTrigger>
              <p className="flex flex-row items-center gap-x-2 text-sm font-normal">
                <IconStar className="h-5 w-5" />
                Featured
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <p
                className={`flex cursor-pointer flex-row items-center justify-between p-2 font-normal hover:text-primary ${featuredOnly ? 'font-normal text-primary' : ''}`}
                onClick={handleFeaturedClick}>
                {tMarketplace('featured')}
                {featuredOnly && <IconCircleCheckFilled />}
              </p>
            </AccordionContent>
          </AccordionItem>
          <hr />
          {/* Sort Order */}
          <AccordionItem value="item-5">
            <AccordionTrigger>
              <p className="flex flex-row items-center gap-x-2 text-sm font-normal">
                <IconArrowsSort className="h-5 w-5" />
                {tMarketplace('sort')}
              </p>{' '}
            </AccordionTrigger>
            <AccordionContent>
              <p
                className={`flex cursor-pointer flex-row items-center  justify-between p-2 font-normal hover:text-primary ${sortOrder === 'newest' ? 'text-primary' : ''}`}
                onClick={() => handleSortChange('newest')}>
                {tMarketplace('sort-newest')}

                {sortOrder === 'newest' && <IconCircleCheckFilled className="text-primary" />}
              </p>
              <p
                className={`flex cursor-pointer flex-row items-center justify-between p-2 font-normal hover:text-primary ${sortOrder === 'oldest' ? 'text-primary' : ''}`}
                onClick={() => handleSortChange('oldest')}>
                {tMarketplace('sort-oldest')}
                {sortOrder === 'oldest' && <IconCircleCheckFilled className="text-primary" />}
              </p>
              <p
                className={`flex cursor-pointer flex-row items-center justify-between p-2 font-normal hover:text-primary ${sortOrder === 'priceLowToHigh' ? 'text-primary' : ''}`}
                onClick={() => handleSortChange('priceLowToHigh')}>
                {tMarketplace('price-asc')}
                {sortOrder === 'priceLowToHigh' && <IconCircleCheckFilled className="text-primary" />}
              </p>
              <p
                className={`flex cursor-pointer flex-row items-center justify-between p-2 font-normal hover:text-primary ${sortOrder === 'priceHighToLow' ? 'text-primary' : ''}`}
                onClick={() => handleSortChange('priceHighToLow')}>
                {tMarketplace('price-desc')}
                {sortOrder === 'priceHighToLow' && <IconCircleCheckFilled className="text-primary" />}
              </p>
              <p
                className={`flex cursor-pointer flex-row items-center justify-between p-2 font-normal hover:text-primary ${sortOrder === 'stockLowToHigh' ? 'text-primary' : ''}`}
                onClick={() => handleSortChange('stockLowToHigh')}>
                {tMarketplace('stock-asc')}
                {sortOrder === 'stockLowToHigh' && <IconCircleCheckFilled className="text-primary" />}
              </p>
              <p
                className={`flex cursor-pointer flex-row items-center justify-between p-2 font-normal hover:text-primary ${sortOrder === 'stockHighToLow' ? 'text-primary' : ''}`}
                onClick={() => handleSortChange('stockHighToLow')}>
                {tMarketplace('stock-desc')}
                {sortOrder === 'stockHighToLow' && <IconCircleCheckFilled className="text-primary" />}
              </p>
            </AccordionContent>
          </AccordionItem>
          <hr />

          {/* Category Filter */}
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <p className="flex flex-row items-center gap-x-2 text-sm font-normal">
                <IconCategory2 className="h-5 w-5" />
                {tMarketplace('categories')}
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-row flex-wrap gap-2">
                {Object.values(productCategoryOptions).map((cat) => (
                  <p
                    className={`flex cursor-pointer items-center justify-between rounded-md border border-border p-2 font-normal  hover:bg-primary hover:text-white  ${category === cat ? ' bg-primary text-white' : 'bg-background  text-foreground'}`}
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}>
                    {tFields(`category-${cat.toLowerCase()}`)}
                  </p>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <hr />

          {/* Stock Filter */}
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <p className="flex flex-row items-center gap-x-2 text-sm font-normal">
                <IconTruckLoading className="h-5 w-5" />
                Stock
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <p
                className={`flex cursor-pointer flex-row items-center justify-between p-2 font-normal hover:text-primary ${stockFilter === 'in' ? 'font-normal text-primary' : ''}`}
                onClick={() => handleStockClick('in')}>
                {tFields('in-stock')}
                {stockFilter === 'in' && <IconCircleCheckFilled />}
              </p>
              <p
                className={`flex cursor-pointer flex-row items-center justify-between p-2 font-normal hover:text-primary ${stockFilter === 'out' ? 'font-normal text-primary' : ''}`}
                onClick={() => handleStockClick('out')}>
                {tFields('out-of-stock')}
                {stockFilter === 'out' && <IconCircleCheckFilled />}
              </p>
            </AccordionContent>
          </AccordionItem>
          <hr />

          {/* Color Filter */}
          <AccordionItem value="item-3">
            <AccordionTrigger className="">
              <p className=":text-primary flex flex-row items-center gap-x-2 text-sm font-normal">
                <IconColorFilter className="h-5 w-5" />
                {tMarketplace('colors')}
              </p>
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap justify-center gap-3">
                {Object.keys(colorHexMap).map((color) => (
                  <div
                    key={color}
                    className={`relative h-7 w-7 cursor-pointer rounded-full border ${
                      selectedColors.includes(color) ? 'border-2 border-dark' : 'border-border'
                    }`}
                    style={{ backgroundColor: colorHexMap[color as keyof typeof colorHexMap] }}
                    onClick={() => handleColorSelect(color)}>
                    {selectedColors.includes(color) && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-600 bg-opacity-50">
                        <IconCheck className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button
          onClick={() => {
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
            setSelectedColors([]);
            setFeaturedOnly(false);
            setSortOrder('newest');
          }}
          className="h-8 border-destructive text-destructive hover:bg-destructive hover:text-white"
          variant={'outline'}
          size={'sm'}>
          {tMarketplace('clear')}
        </Button>
      </div>

      <div className="flex h-full  w-full flex-col space-y-0 rounded-md border border-border bg-background p-4 md:hidden ">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-4">
            <AccordionTrigger>
              <h2 className="flex flex-row items-center justify-start gap-x-2 pb-0 text-xl font-bold ">
                <IconFilter />
                {tMarketplace('filter')}
              </h2>
            </AccordionTrigger>
            <AccordionContent>
              <Accordion type="single" collapsible className="w-full">
                {/* Featured Filter */}

                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    <p className="flex flex-row items-center gap-x-2 text-sm font-normal">
                      <IconStar className="h-5 w-5" />
                      Featured
                    </p>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p
                      className={`flex cursor-pointer flex-row items-center justify-between p-2 font-normal hover:text-primary ${featuredOnly ? 'font-normal text-primary' : ''}`}
                      onClick={handleFeaturedClick}>
                      {tMarketplace('featured')}
                      {featuredOnly && <IconCircleCheckFilled />}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <hr />
                {/* Sort Order */}
                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    <p className="flex flex-row items-center gap-x-2 text-sm font-normal">
                      <IconArrowsSort className="h-5 w-5" />
                      {tMarketplace('sort')}
                    </p>{' '}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p
                      className={`flex cursor-pointer flex-row items-center  justify-between p-2 font-normal hover:text-primary ${sortOrder === 'newest' ? 'text-primary' : ''}`}
                      onClick={() => handleSortChange('newest')}>
                      {tMarketplace('sort-newest')}

                      {sortOrder === 'newest' && <IconCircleCheckFilled className="text-primary" />}
                    </p>
                    <p
                      className={`flex cursor-pointer flex-row items-center justify-between p-2 font-normal hover:text-primary ${sortOrder === 'oldest' ? 'text-primary' : ''}`}
                      onClick={() => handleSortChange('oldest')}>
                      {tMarketplace('sort-oldest')}
                      {sortOrder === 'oldest' && <IconCircleCheckFilled className="text-primary" />}
                    </p>
                    <p
                      className={`flex cursor-pointer flex-row items-center justify-between p-2 font-normal hover:text-primary ${sortOrder === 'priceLowToHigh' ? 'text-primary' : ''}`}
                      onClick={() => handleSortChange('priceLowToHigh')}>
                      {tMarketplace('price-asc')}
                      {sortOrder === 'priceLowToHigh' && <IconCircleCheckFilled className="text-primary" />}
                    </p>
                    <p
                      className={`flex cursor-pointer flex-row items-center justify-between p-2 font-normal hover:text-primary ${sortOrder === 'priceHighToLow' ? 'text-primary' : ''}`}
                      onClick={() => handleSortChange('priceHighToLow')}>
                      {tMarketplace('price-desc')}
                      {sortOrder === 'priceHighToLow' && <IconCircleCheckFilled className="text-primary" />}
                    </p>
                    <p
                      className={`flex cursor-pointer flex-row items-center justify-between p-2 font-normal hover:text-primary ${sortOrder === 'stockLowToHigh' ? 'text-primary' : ''}`}
                      onClick={() => handleSortChange('stockLowToHigh')}>
                      {tMarketplace('stock-asc')}
                      {sortOrder === 'stockLowToHigh' && <IconCircleCheckFilled className="text-primary" />}
                    </p>
                    <p
                      className={`flex cursor-pointer flex-row items-center justify-between p-2 font-normal hover:text-primary ${sortOrder === 'stockHighToLow' ? 'text-primary' : ''}`}
                      onClick={() => handleSortChange('stockHighToLow')}>
                      {tMarketplace('stock-desc')}
                      {sortOrder === 'stockHighToLow' && <IconCircleCheckFilled className="text-primary" />}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <hr />

                {/* Category Filter */}
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <p className="flex flex-row items-center gap-x-2 text-sm font-normal">
                      <IconCategory2 className="h-5 w-5" />
                      {tMarketplace('categories')}
                    </p>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-row flex-wrap gap-2">
                      {Object.values(productCategoryOptions).map((cat) => (
                        <p
                          className={`flex cursor-pointer items-center justify-between rounded-md border border-border p-2 font-normal  hover:bg-primary hover:text-white  ${category === cat ? ' bg-primary text-white' : 'bg-background  text-foreground'}`}
                          key={cat}
                          onClick={() => handleCategoryClick(cat)}>
                          {tFields(`category-${cat.toLowerCase()}`)}
                        </p>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <hr />

                {/* Stock Filter */}
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    <p className="flex flex-row items-center gap-x-2 text-sm font-normal">
                      <IconTruckLoading className="h-5 w-5" />
                      Stock
                    </p>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p
                      className={`flex cursor-pointer flex-row items-center justify-between p-2 font-normal hover:text-primary ${stockFilter === 'in' ? 'font-normal text-primary' : ''}`}
                      onClick={() => handleStockClick('in')}>
                      {tFields('in-stock')}
                      {stockFilter === 'in' && <IconCircleCheckFilled />}
                    </p>
                    <p
                      className={`flex cursor-pointer flex-row items-center justify-between p-2 font-normal hover:text-primary ${stockFilter === 'out' ? 'font-normal text-primary' : ''}`}
                      onClick={() => handleStockClick('out')}>
                      {tFields('out-of-stock')}
                      {stockFilter === 'out' && <IconCircleCheckFilled />}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <hr />

                {/* Color Filter */}
                <AccordionItem value="item-3">
                  <AccordionTrigger className="">
                    <p className=":text-primary flex flex-row items-center gap-x-2 text-sm font-normal">
                      <IconColorFilter className="h-5 w-5" />
                      {tMarketplace('colors')}
                    </p>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap justify-center gap-3">
                      {Object.keys(colorHexMap).map((color) => (
                        <div
                          key={color}
                          className={`relative h-7 w-7 cursor-pointer rounded-full border ${
                            selectedColors.includes(color) ? 'border-2 border-dark' : 'border-border'
                          }`}
                          style={{ backgroundColor: colorHexMap[color as keyof typeof colorHexMap] }}
                          onClick={() => handleColorSelect(color)}>
                          {selectedColors.includes(color) && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gray-600 bg-opacity-50">
                              <IconCheck className="h-5 w-5 text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button
          onClick={() => {
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
            setSelectedColors([]);
            setFeaturedOnly(false);
            setSortOrder('newest');
          }}
          className="h-8 border-destructive text-destructive hover:bg-destructive hover:text-white"
          variant={'outline'}
          size={'sm'}>
          {tMarketplace('clear')}
        </Button>
      </div>

      <div className="flex w-full flex-col items-center justify-start space-y-4">
        <div className="relative w-full">
          <Input
            className="h-12 pl-12 text-sm"
            placeholder={tMarketplace('search')}
            value={search}
            onChange={handleSearchChange}
          />
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
        </div>

        <div className="grid w-full grid-cols-2  gap-4  rounded-md md:grid-cols-3 lg:grid-cols-4">
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
                key={product.name}
                sellers={product.sellers}
                image={product.media[0].key}
                name={product.name}
                wholesalePrice={product.wholesalePrice}
                category={product.category as productCategoryOptions}
                stock={product.stock}
                colors={product.colors}
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
