import { bulkDeleteUsers, deleteUser, getSellers } from '@/actions/users';
import { DataTable } from '@/components/dashboard/table/data-table';
import Breadcrumb from '@/components/ui/breadcrumb';
import { ActionResponse, DataTableUser } from '@/types';
import { IconUsers } from '@tabler/icons-react';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import { SellerColumns } from '@/components/dashboard/table/columns/sellers-columns';

export default async function Sellers() {
  const t = await getTranslations('dashboard');
  const breadcrumbItems = [{ title: t('pages.sellers'), link: '/dashboard/admin/sellers' }];
  const res: ActionResponse = await getSellers();
  const sellersData: DataTableUser[] = res.error ? [] : res.data;

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
    <div className="h-full w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center space-x-2 text-3xl font-bold">
          <IconUsers className="h-7 w-7" stroke={2.9} />
          <h2 className="tracking-tight">{t('pages.sellers')}</h2>
        </div>
        <DataTable
          tag="sellers"
          translationPrefix="user"
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
          columns={SellerColumns}
          data={sellersData}
        />
      </div>
    </div>
  );
}
