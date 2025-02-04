import React from 'react';
import { getTranslations } from 'next-intl/server';
import { MarketplaceHome } from '@/components/dashboard/marketplace/home';
import { getProducts } from '@/actions/products';
import { ActionResponse } from '@/types';
import MarketplaceHeader from '@/components/dashboard/marketplace/header';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard.marketplace' });

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce', 'Marketplace'],
  };
}

export default async function Marketplace() {
  const res: ActionResponse = await getProducts();
  const productsData: any[] = res.error ? [] : res.data;

  return (
    <div className="flex h-full flex-col space-y-6">
      <MarketplaceHeader />
      <MarketplaceHome products={productsData} />
    </div>
  );
}
