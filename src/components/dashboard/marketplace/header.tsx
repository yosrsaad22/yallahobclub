'use client';

import { useCurrentRole } from '@/hooks/use-current-role';
import { Link, useRouter } from '@/navigation';
import { IconBuildingStore } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export default function MarketplaceHeader() {
  const tMarketplace = useTranslations('dashboard.marketplace');
  const router = useRouter();
  return (
    <div className="flex animate-fade-in   flex-col gap-y-6 overflow-y-hidden ">
      <nav className="flex h-16 items-center justify-between overflow-hidden rounded-md border border-b border-border bg-gradient-to-r from-primary via-primary/80 to-primary px-3">
        <div className="flex flex-row items-center text-white">
          <div
            className="flex cursor-pointer flex-row   items-center space-x-2 text-white "
            onClick={() => router.push('/dashboard/marketplace')}>
            <IconBuildingStore className="h-7 w-7" />
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Marketplace</h2>
          </div>

          <div className="text-normal md:text-md flex flex-row items-end justify-center space-x-0 px-4 pt-1 text-sm md:space-x-6 md:px-6">
            <Link
              className=" hidden hover:underline focus-visible:ring-0 md:flex"
              href={`/dashboard/marketplace`}
              passHref>
              {tMarketplace('home')}
            </Link>
            <Link
              className="hover:underline focus-visible:ring-0"
              href={`/dashboard/marketplace/all-products`}
              passHref>
              {tMarketplace('all-products')}
            </Link>
            <Link
              className=" hidden hover:underline focus-visible:ring-0 md:flex"
              href={`/dashboard/marketplace/all-products?featured=true`}
              passHref>
              {tMarketplace('featured')}
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
