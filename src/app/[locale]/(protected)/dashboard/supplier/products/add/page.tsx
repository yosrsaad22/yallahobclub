import Breadcrumb from '@/components/ui/breadcrumb';
import { IconBoxSeam } from '@tabler/icons-react';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import { AddProductForm } from '@/components/dashboard/forms/add-product-form';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return {
    title: 'Ecomness - ' + t('pages.product-add'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export default async function ProductAdd() {
  const t = await getTranslations('dashboard');
  const breadcrumbItems = [
    { title: t('pages.products'), link: '/dashboard/admin/products' },
    { title: t('pages.product-add'), link: '/#' },
  ];

  return (
    <div className="w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center space-x-2 text-3xl font-bold">
          <IconBoxSeam className="h-7 w-7" />
          <h2 className="tracking-tight">{t('pages.product-add')}</h2>
        </div>
        <AddProductForm />
      </div>
    </div>
  );
}
