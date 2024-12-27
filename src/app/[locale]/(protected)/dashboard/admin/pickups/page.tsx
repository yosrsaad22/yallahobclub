import { DataTable } from '@/components/dashboard/table/data-table';
import Breadcrumb from '@/components/ui/breadcrumb';
import { ActionResponse } from '@/types';
import { IconTruckDelivery } from '@tabler/icons-react';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import { adminGetPickups, printPickup } from '@/actions/pickups';
import { AdminPickupColumns } from '@/components/dashboard/table/columns/pickup-columns';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return {
    title: 'Ecomness - ' + t('pages.pickups'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export const maxDuration = 60;

export default async function Pickups() {
  const t = await getTranslations('dashboard');
  const breadcrumbItems = [{ title: t('pages.pickups'), link: '/dashboard/admin/pickups' }];
  const res: ActionResponse = await adminGetPickups();
  const pickupsData: any[] = res.error ? [] : res.data;

  const handlePrintPickup = async (id: string) => {
    'use server';
    const res = await printPickup(id);
    return res;
  };

  return (
    <div className="w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center space-x-2 text-3xl font-bold">
          <IconTruckDelivery className="h-7 w-7" />
          <h2 className="tracking-tight">{t('pages.pickups')}</h2>
        </div>
        <DataTable
          tag="pickups"
          translationPrefix="pickup"
          onDelete={undefined}
          onBulkDelete={undefined}
          onRequestPickup={undefined}
          columns={AdminPickupColumns}
          data={pickupsData}
          showActions={false}
          redirectToDetails={false}
          showAddButton={false}
          showSelect={true}
          showPrintPickupButton={true}
          onPrintPickup={handlePrintPickup}
          showBulkDeleteButton={false}
          showCreatePickupButton={false}
        />
      </div>
    </div>
  );
}
