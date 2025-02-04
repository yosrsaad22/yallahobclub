import Breadcrumb from '@/components/ui/breadcrumb';
import { IconShoppingCart } from '@tabler/icons-react';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import { AddOrderForm } from '@/components/dashboard/forms/add-order-form';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return {
    title: 'Ecomness - ' + t('pages.order-add'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export default async function OrderAdd() {
  const t = await getTranslations('dashboard');
  const breadcrumbItems = [
    { title: t('pages.orders'), link: '/dashboard/seller/orders' },
    { title: t('pages.order-add'), link: '/#' },
  ];

  return (
    <div className="w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center space-x-2 text-3xl font-bold">
          <IconShoppingCart className="h-7 w-7" />
          <h2 className="tracking-tight">{t('pages.order-add')}</h2>
        </div>
        <AddOrderForm />
      </div>
    </div>
  );
}
