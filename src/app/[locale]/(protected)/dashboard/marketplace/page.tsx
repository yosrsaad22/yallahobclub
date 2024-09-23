import React from 'react';
import { getTranslations } from 'next-intl/server';
import MarketplaceHeader from '@/components/dashboard/marketplace/header';
import Banner from '@/components/dashboard/marketplace/banner';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard.marketplace' });

  return {
    title: t('metadata.title'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce', 'Marketplace'],
  };
}

export default async function Marketplace() {
  return (
    <div className="z-10 flex flex-col space-y-4 p-4 pt-6 md:p-6">
      <MarketplaceHeader />
      <Banner />
    </div>
  );
}
