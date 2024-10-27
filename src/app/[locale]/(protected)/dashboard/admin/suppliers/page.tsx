import { bulkDeleteUsers, deleteUser, getSuppliers } from '@/actions/users';
import { DataTable } from '@/components/dashboard/table/data-table';
import Breadcrumb from '@/components/ui/breadcrumb';
import { ActionResponse, DataTableUser } from '@/types';
import { IconBuildingWarehouse } from '@tabler/icons-react';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import { SupplierColumns } from '@/components/dashboard/table/columns/suppliers-columns';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return {
    title: 'Ecomness - ' + t('pages.suppliers'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export default async function Sellers() {
  const t = await getTranslations('dashboard');
  const breadcrumbItems = [{ title: t('pages.suppliers'), link: '/dashboard/admin/suppliers' }];
  const res: ActionResponse = await getSuppliers();
  const suppliersData: DataTableUser[] = res.error ? [] : res.data;

  const handleDelete = async (id: string) => {
    'use server';
    const res = await deleteUser(id);
    return res;
  };

  const handleBulkDelete = async (ids: string[]) => {
    'use server';
    const res = await bulkDeleteUsers(ids);
    return res;
  };

  return (
    <div className="w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center space-x-2 text-3xl font-bold">
          <IconBuildingWarehouse className="h-7 w-7" />
          <h2 className="tracking-tight">{t('pages.suppliers')}</h2>
        </div>
        <DataTable
          tag="suppliers"
          translationPrefix="user"
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
          columns={SupplierColumns}
          data={suppliersData}
        />
      </div>
    </div>
  );
}
