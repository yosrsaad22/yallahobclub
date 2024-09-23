'use client';

import { Button, LinkButton } from '@/components/ui/button';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

export default function Banner() {
  const t = useTranslations('dashboard.marketplace');
  const [searchValue, setSearchValue] = useState('');
  const role = useCurrentRole();

  return (
    <div className="rounded-md border bg-primary/20 p-6">
      {/*}   <Input
        placeholder={t('search')}
        value={searchValue}
        type="text"
        className="mx-auto h-12 w-full focus-visible:ring-0 md:w-2/3"
        onChange={(e) => setSearchValue(e.target.value)}
      />
   */}
      <div className="flex h-full w-full flex-col justify-center gap-y-6 overflow-x-hidden    overflow-y-hidden py-6  md:flex-row  md:p-6">
        <div className="flex w-full flex-col items-center justify-center space-y-3 pb-1">
          <div className="flex flex-col space-y-6 py-6">
            <h2 className="text-center text-4xl font-bold tracking-tight text-secondary md:text-left">
              Wholesale Marketplace{' '}
            </h2>
            <p className="text-center text-lg text-foreground md:text-left">
              Find the best products to sell online from our hand picked and tested winning products for wholesale
              prices to maximise your profit
            </p>
            <LinkButton
              className="mx-auto w-24 text-white md:mx-0"
              size={'sm'}
              variant={'secondary'}
              href={''}
              passHref>
              Explore
            </LinkButton>
          </div>
        </div>
        <div className="flex w-[500px] flex-col items-center justify-start pb-1 ">
          <Image alt="cart" src={'/img/catalog.png'} height={250} width={250} />
        </div>
      </div>
    </div>
  );
}
