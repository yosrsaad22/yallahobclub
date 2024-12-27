import { DataTable } from '@/components/dashboard/table/data-table';
import Breadcrumb from '@/components/ui/breadcrumb';
import { ActionResponse } from '@/types';
import { IconShoppingCart } from '@tabler/icons-react';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import { AdminOrderColumns, SellerOrderColumns } from '@/components/dashboard/table/columns/order-columns';
import { adminGetOrders, markOrdersAsPaid, sellerGetOrders, trackOrders } from '@/actions/orders';
import { Order } from '@prisma/client';
import { adminRequestPickup, requestPickup } from '@/actions/pickups';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return {
    title: 'Ecomness - ' + t('pages.orders'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export const maxDuration = 60;

export default async function Orders() {
  const t = await getTranslations('dashboard');
  const breadcrumbItems = [{ title: t('pages.orders'), link: '/dashboard/admin/orders' }];
  const res: ActionResponse = await adminGetOrders();
  const ordersData: any[] = res.error
    ? []
    : res.data.map((order: Order) => ({
        ...order,
        fullName: `${order.firstName} ${order.lastName}`,
      }));

  const handleRequestPickup = async (ids: string[]) => {
    'use server';
    const res = await adminRequestPickup(ids);
    return res;
  };

  const handleMarkAsPaid = async (ids: string[]) => {
    'use server';
    const res = await markOrdersAsPaid(ids);
    return res;
  };

  return (
    <div className="w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center space-x-2 text-3xl font-bold">
          <IconShoppingCart className="h-7 w-7" />
          <h2 className="tracking-tight">{t('pages.orders')}</h2>
        </div>
        <DataTable
          tag="orders"
          translationPrefix="order"
          onDelete={undefined}
          onBulkDelete={undefined}
          onRequestPickup={handleRequestPickup}
          onMarkAsPaid={handleMarkAsPaid}
          columns={AdminOrderColumns}
          data={ordersData}
          showActions={false}
          showBulkDeleteButton={false}
          showCreatePickupButton={true}
          showMarkAsPaidButton={true}
        />
      </div>
    </div>
  );
}
