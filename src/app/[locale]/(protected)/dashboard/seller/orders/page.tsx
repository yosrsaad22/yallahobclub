import { DataTable } from '@/components/dashboard/table/data-table';
import Breadcrumb from '@/components/ui/breadcrumb';
import { ActionResponse } from '@/types';
import { IconTruckDelivery } from '@tabler/icons-react';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import { SellerOrderColumns } from '@/components/dashboard/table/columns/order-columns';
import { sellerGetOrders } from '@/actions/orders';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return {
    title: 'Ecomness - ' + t('pages.orders'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export default async function Orders() {
  const t = await getTranslations('dashboard');
  const breadcrumbItems = [{ title: t('pages.orders'), link: '/dashboard/seller/orders' }];
  const res: ActionResponse = await sellerGetOrders();
  const ordersData: any[] = res.error ? [] : res.data;

  return (
    <div className="w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center space-x-2 text-3xl font-bold">
          <IconTruckDelivery className="h-7 w-7" />
          <h2 className="tracking-tight">{t('pages.orders')}</h2>
        </div>
        <DataTable
          tag="orders"
          translationPrefix="order"
          onDelete={undefined}
          onBulkDelete={undefined}
          columns={SellerOrderColumns}
          data={ordersData}
          showActions={false}
          showSelect={false}
        />
      </div>
    </div>
  );
}
