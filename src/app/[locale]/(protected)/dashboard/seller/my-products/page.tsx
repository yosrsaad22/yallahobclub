import Breadcrumb from '@/components/ui/breadcrumb';
import { MediaType } from '@/types';
import { IconBoxSeam } from '@tabler/icons-react';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import { bulkDeleteProducts, deleteProduct, getProductsBySeller } from '@/actions/products';
import { MyProducts } from '@/components/dashboard/seller/my-products';
import { currentUser } from '@/lib/auth';
import { getQueryClient } from '@/lib/query';
import { Product } from '@prisma/client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return {
    title: 'Ecomness - ' + t('pages.my-products'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export default async function Products() {
  const t = await getTranslations('dashboard');
  const breadcrumbItems = [{ title: t('pages.my-products'), link: '/dashboard/seller/products' }];
  const user = await currentUser();

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['my-products'],
    queryFn: async () => {
      const res = await getProductsBySeller();
      if (res.error) throw new Error(res.error);
      if (res.success) return res.data.filter((product: Product & { media: MediaType[] }) => product.published);
    },
  });

  const handleDelete = async (id: string) => {
    'use server';
    const res = await deleteProduct(id);
    return res;
  };

  const handleBulkDelete = async (ids: string[]) => {
    'use server';
    const res = await bulkDeleteProducts(ids);
    return res;
  };

  return (
    <div className=" w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center space-x-2 text-3xl font-bold">
          <IconBoxSeam className="h-7 w-7" />
          <h2 className="tracking-tight">{t('pages.my-products')}</h2>
        </div>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <MyProducts />
        </HydrationBoundary>
      </div>
    </div>
  );
}
