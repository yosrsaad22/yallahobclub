import Breadcrumb from '@/components/ui/breadcrumb';
import { IconAffiliate, IconInfoCircleFilled } from '@tabler/icons-react';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return {
    title: 'Ecomness - ' + t('pages.integrations'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export default async function Orders() {
  const t = await getTranslations('dashboard');
  const breadcrumbItems = [{ title: t('pages.integrations'), link: '/dashboard/seller/integrations' }];

  return (
    <div className="w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center space-x-2 text-3xl font-bold">
          <IconAffiliate className="h-7 w-7" />
          <h2 className="tracking-tight">{t('pages.integrations')}</h2>
        </div>
        <div className="flex h-full w-full flex-col items-center gap-8 pt-2">
          <div className="flex w-full items-center space-x-4 rounded-md border border-border bg-background p-2 py-4">
            <IconInfoCircleFilled className="h-10 w-10 flex-shrink-0  text-primary" />
            <h1 className="text-sm text-muted-foreground">{t('text.integrations-info')} </h1>
          </div>
          <div className="grid h-full w-full grid-cols-2 gap-8 md:grid-cols-3 ">
            <div className="flex h-full w-full flex-col  rounded-md border border-border bg-background p-2 duration-300 ease-in-out ">
              <div className="flex h-[150px] w-full items-center justify-center rounded-md border border-border bg-gray-100 dark:bg-[#525256]">
                <Image src={'/img/woocommerce.png'} height={130} width={130} alt="wordpress" />
              </div>
              <div className="flex w-full flex-col  pt-3">
                <div className="flex gap-2">
                  <h3 className="font-semibold">WooCommerce</h3>
                  <Badge
                    variant={'outline'}
                    className="animate-pulse border-2 border-secondary text-xs  font-normal text-secondary">
                    {t('text.coming-soon')}
                  </Badge>
                </div>{' '}
                <p className="pt-1 text-sm text-muted-foreground">
                  {t('text.integration-description', { subject: 'Woocommerce' })}
                </p>
                <Button size={'sm'} disabled className="mt-4" variant={'primary'}>
                  {t('text.configure')}
                </Button>
              </div>
            </div>
            <div className="flex h-full w-full flex-col rounded-md border border-border bg-background p-2 duration-300 ease-in-out hover:scale-105 ">
              <div className="flex h-[150px] w-full items-center  justify-center rounded-md border border-border bg-gray-100 dark:bg-[#525256]">
                <Image src={'/img/tiktakpro.png'} height={150} width={150} alt="wordpress" />
              </div>
              <div className="flex w-full flex-col justify-between  pt-3">
                <div className="flex gap-2">
                  <h3 className="font-semibold">Tiktak Pro</h3>
                  <Badge
                    variant={'outline'}
                    className="animate-pulse border-2 border-secondary text-xs  font-normal text-secondary">
                    {t('text.coming-soon')}
                  </Badge>
                </div>{' '}
                <p className="pt-1 text-sm text-muted-foreground">
                  {t('text.integration-description', { subject: 'Titak Pro' })}
                </p>
                <Button size={'sm'} disabled className="mt-4" variant={'primary'}>
                  {t('text.configure')}
                </Button>
              </div>
            </div>
            <div className="flex h-full w-full flex-col rounded-md border border-border bg-background p-2 duration-300 ease-in-out hover:scale-105 ">
              <div className="flex h-[150px] w-full items-center justify-center rounded-md border border-border bg-gray-100 dark:bg-[#525256] ">
                <Image src={'/img/converty.png'} height={150} width={150} alt="wordpress" />
              </div>
              <div className="flex w-full flex-col justify-between  pt-3">
                <div className="flex gap-2">
                  <h3 className="font-semibold">Converty</h3>
                  <Badge
                    variant={'outline'}
                    className="animate-pulse border-2 border-secondary text-xs  font-normal text-secondary">
                    {t('text.coming-soon')}
                  </Badge>
                </div>
                <p className="pt-1 text-sm text-muted-foreground">
                  {t('text.integration-description', { subject: 'Converty' })}
                </p>
                <Button size={'sm'} disabled className="mt-4" variant={'primary'}>
                  {t('text.configure')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
