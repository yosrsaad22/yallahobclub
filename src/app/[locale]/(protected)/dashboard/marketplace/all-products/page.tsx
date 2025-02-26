import React from 'react';
import { getTranslations } from 'next-intl/server';
import { getProducts } from '@/actions/products';
import { ActionResponse, DataTableUser, MediaType } from '@/types';
import ProductGrid from '@/components/dashboard/marketplace/product-grid';
import { getQueryClient } from '@/lib/query';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import MarketplaceHeader from '@/components/dashboard/marketplace/header';
import { Product } from '@prisma/client';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard.marketplace' });

  return {
    title: t('all-products-metadata.title'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce', 'Marketplace'],
  };
}

export default async function AllProducts() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
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

  return (
    <div className="flex flex-col space-y-6">
      <MarketplaceHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductGrid />
      </HydrationBoundary>
    </div>
  );
}
