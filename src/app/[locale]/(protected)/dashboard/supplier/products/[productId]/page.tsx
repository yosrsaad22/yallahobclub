import Breadcrumb from '@/components/ui/breadcrumb';
import { IconBoxSeam, IconBuildingStore } from '@tabler/icons-react';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import NotFound from '@/app/[locale]/[...not_found]/page';
import { getProduct } from '@/actions/products';
import { EditProductForm } from '@/components/dashboard/forms/edit-product-form';
import { LinkButton } from '@/components/ui/button';

interface ProductDetailsProps {
  params: { productId: string };
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return {
    title: 'Ecomness - ' + t('pages.product-details'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export default async function ProductDetails({ params }: ProductDetailsProps) {
  const t = await getTranslations('dashboard');
  const breadcrumbItems = [
    { title: t('pages.products'), link: '/dashboard/admin/products' },
    { title: t('pages.product-details'), link: '/#' },
  ];

  const res = await getProduct(params.productId);
  if (res.error) {
    return NotFound();
  }
  const productData = res.error ? null : res.data;

  return (
    <div className=" w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center space-x-2 text-3xl font-bold">
            <IconBoxSeam className="h-7 w-7" />
            <h2 className="tracking-tight">{t('pages.product-details')}</h2>
          </div>
          <LinkButton
            className="gap-x-2 px-3"
            variant={'primary'}
            size={'default'}
            href={`/dashboard/marketplace/all-products/${params.productId}`}>
            <IconBuildingStore />
            {t('view-in-market')}
          </LinkButton>
        </div>
        <EditProductForm productData={productData} />
      </div>
    </div>
  );
}
