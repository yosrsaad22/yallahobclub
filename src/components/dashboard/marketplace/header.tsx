'use client';

import { Button } from '@/components/ui/button';
import { useCurrentRole } from '@/hooks/use-current-role';
import { Link } from '@/navigation';
import { IconBuildingStore, IconShoppingBag } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export default function MarketplaceHeader() {
  const t = useTranslations('dashboard.marketplace');
  const role = useCurrentRole();

  return (
    <div className="flex w-full flex-col gap-y-6 overflow-y-hidden ">
      <nav className="flex h-16 items-center justify-between overflow-hidden  rounded-md border-b bg-primary px-3">
        <div className="flex flex-row items-center space-x-2   text-white">
          <IconBuildingStore className="h-7 w-7" />
          <h2 className="text-3xl font-bold tracking-tight">Marketplace</h2>
          <div className="text-normal text-md hidden flex-row items-end justify-end space-x-6 px-6 pt-1 md:flex">
            <Link
              className="text-white focus-visible:ring-0"
              href={`/dashboard/${role?.toLowerCase()}/marketplace/featured`}
              passHref>
              Featured
            </Link>
            <Link
              className="text-white focus-visible:ring-0"
              href={`/dashboard/${role?.toLowerCase()}/marketplace/all-products`}
              passHref>
              All Products
            </Link>
            <Link
              href={`/dashboard/${role?.toLowerCase()}/marketplace/categories`}
              className="text-white focus-visible:ring-0"
              passHref>
              Categories
            </Link>
          </div>
        </div>
        <div className="relative flex items-center gap-x-3">
          <Button
            className="border-white bg-transparent hover:bg-white/20 focus-visible:ring-0"
            variant={'outline'}
            size={'icon'}>
            <IconShoppingBag className="text-white " />
          </Button>
        </div>
      </nav>
    </div>
  );
}
