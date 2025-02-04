'use client';

import { Link, useRouter } from '@/navigation';
import {
  IconArrowRight,
  IconCategory2,
  IconChevronLeft,
  IconChevronRight,
  IconPackageExport,
  IconStar,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { productCategoryData, productCategoryOptions } from '@/lib/constants';
import { Product } from '@prisma/client';
import { ProductCard } from '../cards/product-card';
import { DataTableUser, MediaType } from '@/types';

interface MarketplaceHomeProps {
  products: (Product & { media: MediaType[]; sellers: DataTableUser[] })[];
}

export const MarketplaceHome: React.FC<MarketplaceHomeProps> = ({ products }) => {
  const t = useTranslations('dashboard.marketplace');
  const tFields = useTranslations('fields');
  const featuredProducts = products.filter((product) => product.published && product.featured).slice(0, 10);
  const newProducts = products.filter((product) => product.published).slice(0, 10);
  const router = useRouter();

  return (
    <div className="flex w-full flex-col gap-y-12">
      <div className="flex animate-fade-in flex-col justify-center gap-y-6 overflow-visible">
        {/* Layout for lg and higher */}
        <div className="hidden h-[400px] w-full gap-4 xl:flex">
          {/* Furniture card - 50% width */}
          <div className="group relative flex h-full w-1/2 justify-center rounded-md bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300">
            <Image
              src="/img/furniture-banner.webp"
              alt="Furniture"
              width={700}
              height={700}
              className=" absolute bottom-0 rounded-md transition-transform duration-300 ease-in-out group-hover:scale-110"
            />
            <div className="absolute inset-0 flex flex-col items-start justify-start gap-y-2 p-8 text-black/90">
              <h2 className="text-2xl font-bold">{t('furniture-banner.title')}</h2>
              <p>{t('furniture-banner.text')}</p>
              <Link
                href="/dashboard/marketplace/all-products?category=FURNITURE"
                className="mt-2 flex cursor-pointer flex-row items-center justify-center rounded-sm border border-black bg-transparent px-2 py-1 hover:bg-black/90 hover:text-white/90">
                <p className="text-sm">{t('explore')}</p>
                <IconChevronRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Right side 50% width - with decoration card taking 25% full height and tech card with smaller one */}
          <div className="flex h-full w-1/2 flex-row gap-4">
            {/* Decoration Card */}
            <div className="group relative h-full w-2/3 overflow-visible rounded-md bg-[#fce8e9]">
              <div className="absolute inset-0 z-[6] flex w-[65%] flex-col items-start justify-start gap-y-2 p-4 text-black/90">
                <h2 className="text-2xl font-bold">{t('decoration-banner.title')}</h2>
                <p>{t('decoration-banner.text')}</p>
                <Link
                  href="/dashboard/marketplace/all-products?category=DECORATION"
                  className="mt-2 flex cursor-pointer flex-row items-center justify-center rounded-sm border border-black bg-transparent px-2 py-1 hover:bg-black/90 hover:text-white/90">
                  <p className="text-sm">{t('explore')}</p>
                  <IconChevronRight className="h-5 w-5" />
                </Link>
              </div>
              <div>
                <Image
                  src="/img/decoration-banner.webp"
                  alt="decor"
                  width={600}
                  height={600}
                  className="absolute bottom-3 right-[-3rem] z-[5] h-[310px] w-[200px] transform object-fill duration-300 ease-in-out group-hover:scale-110"
                />
              </div>
            </div>

            {/* Two smaller cards */}
            <div className="flex w-full flex-col gap-4">
              <div className="group relative h-full overflow-visible rounded-md bg-[#beeff1]">
                <div className="absolute inset-0 flex w-[75%] flex-col items-start justify-start gap-y-2 p-4 text-black/90">
                  <h2 className="text-2xl font-bold">{t('clothing-banner.title')}</h2>
                  <p>{t('clothing-banner.text')}</p>
                  <Link
                    href="/dashboard/marketplace/all-products?category=CLOTHING"
                    className="mt-2 flex cursor-pointer flex-row items-center justify-center rounded-sm border border-black bg-transparent px-2 py-1 hover:bg-black/90 hover:text-white/90">
                    <p className="text-sm">{t('explore')}</p>
                    <IconChevronRight className="h-5 w-5" />
                  </Link>
                </div>
                <Image
                  src="/img/clothing-banner.webp"
                  alt="tech"
                  width={600}
                  height={600}
                  className="absolute -bottom-5 right-1 z-[5] h-[220px] w-[150px]  transform object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
              </div>
              <div className="group relative h-full overflow-hidden rounded-md bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
                <div className="absolute inset-0 flex w-[75%] flex-col items-start justify-start gap-y-2 p-4 text-black/90">
                  <h2 className="text-2xl font-bold">{t('tech-banner.title')}</h2>
                  <p>{t('tech-banner.text')}</p>
                  <Link
                    href="/dashboard/marketplace/all-products?category=ELECTRONICS"
                    className="mt-2 flex cursor-pointer flex-row items-center justify-center rounded-sm border border-black bg-transparent px-2 py-1 hover:bg-black/90 hover:text-white/90">
                    <p className="text-sm">{t('explore')}</p>
                    <IconChevronRight className="h-5 w-5" />
                  </Link>
                </div>
                <Image
                  src="/img/tech-banner.webp"
                  alt="tech"
                  width={600}
                  height={600}
                  className="absolute -bottom-5 -right-8 h-[130%] w-[270px] translate-x-1/4 translate-y-1/4 transform object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Layout for md screens */}
        <div className="flex w-full flex-col gap-4 xl:hidden">
          {/* Furniture card - full width */}
          <div className="group flex h-[260px] w-full flex-row items-end justify-center rounded-md bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300">
            <Image
              src="/img/furniture-banner.webp"
              alt="Furniture"
              width={500}
              height={500}
              className=" mx-auto mt-8 rounded-md object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
            />
            <div className="absolute inset-0 flex flex-col items-start justify-start gap-y-2 p-4 text-black/90">
              <h2 className="text-xl font-bold">{t('furniture-banner.title')}</h2>
              <p className="text-sm">{t('furniture-banner.text')}</p>
              <Link
                href="/dashboard/marketplace/all-products?category=FURNITURE"
                className="mt-1 flex cursor-pointer flex-row items-center justify-center rounded-sm border border-black bg-transparent px-2 py-1 hover:bg-black/90 hover:text-white/90">
                <p className="text-xs">{t('explore')}</p>
                <IconChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Decoration card - 50% width and two smaller cards sharing 50% */}
          <div className="flex h-[360px] w-full gap-4">
            {/* Decoration card - 50% */}
            <div className="group relative h-full w-1/2 overflow-visible rounded-md bg-[#fce8e9]">
              <Image
                src="/img/decoration-banner.webp"
                alt="decor"
                width={600}
                height={600}
                className="absolute -right-8 bottom-3 z-[5] h-[240px] w-[160px] transform object-fill duration-300 ease-in-out group-hover:scale-110 md:right-2 md:h-[290px] md:w-[210px]"
              />
              <div className="absolute inset-0 z-[6] flex w-[75%] flex-col items-start justify-start gap-y-2 p-3 text-black/90">
                <h2 className="text-xl font-bold">{t('decoration-banner.title')}</h2>
                <p className="text-sm">{t('decoration-banner.text')}</p>
                <Link
                  href="/dashboard/marketplace/all-products?category=DECORATION"
                  className="mt-1 flex cursor-pointer flex-row items-center justify-center rounded-sm border border-black bg-transparent px-2 py-1 hover:bg-black/90 hover:text-white/90">
                  <p className="text-xs">{t('explore')}</p>
                  <IconChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Two smaller cards - 50% height */}
            <div className="flex h-full w-1/2 flex-col gap-4">
              <div className="group  relative h-1/2 w-full overflow-hidden rounded-md bg-[#beeff1]">
                <Image
                  src="/img/clothing-banner.webp"
                  alt="tech"
                  width={600}
                  height={600}
                  className="absolute bottom-0 right-0 z-[5] h-[150px] w-[70px]  transform object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 flex w-[75%] flex-col items-start justify-start gap-y-2 p-3 text-black/90">
                  <h2 className="text-xl font-bold">{t('clothing-banner.title')}</h2>
                  <p className="text-sm">{t('clothing-banner.text')}</p>
                  <Link
                    href={'/dashboard/marketplace/all-products?category=CLOTHING'}
                    className="mt-1 flex cursor-pointer flex-row items-center justify-center rounded-sm border border-black bg-transparent px-2 py-1 hover:bg-black/90 hover:text-white/90">
                    <p className="text-xs">{t('explore')}</p>
                    <IconChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="group  relative h-1/2 w-full overflow-hidden rounded-md bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200">
                <Image
                  src="/img/tech-banner.webp"
                  alt="tech"
                  width={600}
                  height={600}
                  className="absolute -bottom-6 -right-3 h-[93%] w-[170px] translate-x-1/4 translate-y-1/4 transform object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 flex w-[85%] flex-col items-start justify-start gap-y-2 p-3 text-black/90">
                  <h2 className="text-xl font-bold">{t('tech-banner.title')}</h2>
                  <p className="text-sm">{t('tech-banner.text')}</p>
                  <Link
                    href={'/dashboard/marketplace/all-products?category=ELECTRONICS'}
                    className="mt-1 flex cursor-pointer flex-row items-center justify-center rounded-sm border border-black bg-transparent px-2 py-1 hover:bg-black/90 hover:text-white/90">
                    <p className="text-xs">{t('explore')}</p>
                    <IconChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" flex w-full  animate-fade-in flex-col items-center justify-center ">
        <h2 className="flex w-full flex-row items-center justify-start gap-x-2 text-xl font-bold md:text-2xl">
          <IconCategory2 />
          {t('categories')}
        </h2>

        <Carousel className="relative h-full w-[95%] ">
          <CarouselContent className=" py-6">
            {productCategoryData.map((_, index) => (
              <CarouselItem
                onClick={() => router.push('/dashboard/marketplace/all-products?category=' + _.name)}
                key={index}
                className=" relative mx-auto ml-4 flex h-[110px] w-full basis-[32%] cursor-pointer flex-col items-center rounded-lg bg-muted  px-2 shadow-md transition-transform duration-300 ease-in-out hover:scale-110 md:ml-3 md:h-[130px] lg:h-[120px] lg:basis-[14%]">
                <p className="md:text-md w-full overflow-hidden text-ellipsis whitespace-normal break-words pb-4 text-center text-sm font-medium md:font-semibold">
                  {tFields('category-' + _.name.toLocaleLowerCase())}
                </p>
                <Image
                  src={_.imageUrl}
                  className="absolute bottom-0 object-contain "
                  alt={_.name}
                  width={200}
                  height={200}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <div className="jusitfy-center flex   flex-col items-center gap-y-6">
        <div className="flex w-full  flex-row items-center justify-between">
          <h2 className=" flex flex-row items-center justify-start gap-x-2 text-xl font-bold  md:text-2xl">
            <IconPackageExport />
            {t('new-arrivals')}
          </h2>
          <Link
            href={'/dashboard/marketplace/all-products'}
            className=" flex flex-row items-center justify-end gap-x-1 pr-2 text-sm text-primary hover:text-secondary">
            {t('view-more')} <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 ">
          {newProducts.length > 0 ? (
            newProducts.map((product: any) => (
              <ProductCard
                id={product.id}
                imageHeight={200}
                imageWidth={200}
                key={product.name}
                sellers={product.sellers}
                image={product.media[0].key}
                profitMargin={product.profitMargin}
                name={product.name}
                category={product.category as productCategoryOptions}
                stock={product.stock}
                wholesalePrice={product.wholesalePrice}
                colors={product.colors}
              />
            ))
          ) : (
            <p className="col-span-2 text-center text-sm text-muted-foreground md:col-span-5">{t('no-results')}</p>
          )}
        </div>
      </div>

      <div className="jusitfy-center flex flex-col  items-center gap-y-6 pb-8">
        <div className="flex w-full flex-row items-center justify-between">
          <h2 className="flex flex-row items-center justify-start gap-x-2 text-xl font-bold  md:text-2xl">
            <IconStar />
            {t('featured')}
          </h2>{' '}
          <Link
            href={'/dashboard/marketplace/all-products?featured=true'}
            className="flex flex-row items-center justify-end gap-x-1 pr-2 text-sm text-primary hover:text-secondary">
            {t('view-more')} <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>{' '}
        <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard
                id={product.id}
                imageHeight={200}
                imageWidth={200}
                sellers={product.sellers}
                key={product.name}
                image={product.media[0].key}
                profitMargin={product.profitMargin}
                name={product.name}
                category={product.category as productCategoryOptions}
                stock={product.stock}
                wholesalePrice={product.wholesalePrice}
                colors={product.colors}
              />
            ))
          ) : (
            <p className="col-span-2 text-center text-sm  text-muted-foreground md:col-span-5">{t('no-results')}</p>
          )}
        </div>
      </div>
    </div>
  );
};
