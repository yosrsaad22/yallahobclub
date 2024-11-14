import Breadcrumb from '@/components/ui/breadcrumb';
import { IconShoppingCart } from '@tabler/icons-react';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import NotFound from '@/app/[locale]/[...not_found]/page';
import { printLabel, getOrderById } from '@/actions/orders';
import OrderDetailsCard from '@/components/dashboard/cards/order-details-card';

interface OrderDetailsProps {
  params: { orderId: string };
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return {
    title: 'Ecomness - ' + t('pages.order-details'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export default async function OrderDetails({ params }: OrderDetailsProps) {
  const t = await getTranslations('dashboard');
  const breadcrumbItems = [
    { title: t('pages.orders'), link: '/dashboard/supplier/orders' },
    { title: t('pages.order-details'), link: '/#' },
  ];

  const res = await getOrderById(params.orderId);
  if (res.error) {
    return NotFound();
  }
  const orderData = res.error ? null : res.data;

  const handlePrintLabel = async (id: string) => {
    'use server';
    const res = await printLabel(id);
    return res;
  };

  return (
    <div className="w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center space-x-2 text-3xl font-bold">
            <IconShoppingCart className="h-7 w-7" />
            <h2 className="tracking-tight">{t('pages.order-details')}</h2>
          </div>
        </div>
        <OrderDetailsCard onPrintLabel={handlePrintLabel} order={orderData} />
      </div>
    </div>
  );
}
