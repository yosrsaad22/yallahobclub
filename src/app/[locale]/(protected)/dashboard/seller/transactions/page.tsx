import { DataTable } from '@/components/dashboard/table/data-table';
import Breadcrumb from '@/components/ui/breadcrumb';
import { ActionResponse, DataTableUser } from '@/types';
import { IconReceipt2, IconShoppingCart } from '@tabler/icons-react';
import React from 'react';
import { getTranslations } from 'next-intl/server';

import { createWithdrawRequest, getTransactionByUser, getWidthdrawRequestByUser } from '@/actions/transactions';
import { WithdrawRequest } from '@prisma/client';
import { UserTransactionColumns } from '@/components/dashboard/table/columns/transaction-columns';
import { WithdrawRequestsCard } from '@/components/dashboard/cards/withdraw-requests-card';
import { currentUser } from '@/lib/auth';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return {
    title: 'Ecomness - ' + t('pages.transactions'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export default async function Transactions() {
  const t = await getTranslations('dashboard');
  const breadcrumbItems = [{ title: t('pages.transactions'), link: '/dashboard/admin/transactions' }];
  const user = await currentUser();

  const transactionsRes: ActionResponse = await getTransactionByUser(user?.id!);
  const transactionsData: any[] = transactionsRes.error ? [] : transactionsRes.data;
  const WithdrawRequestsRes: ActionResponse = await getWidthdrawRequestByUser(user?.id!);
  const WithdrawRequestsData: (WithdrawRequest & { user: DataTableUser })[] = WithdrawRequestsRes.error
    ? []
    : WithdrawRequestsRes.data;

  const handleCreateWithdrawRequest = async (data: any) => {
    'use server';
    const res = await createWithdrawRequest(data);
    return res;
  };

  return (
    <div className="w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center space-x-2 text-3xl font-bold">
          <IconReceipt2 className="h-7 w-7" />
          <h2 className="tracking-tight">{t('pages.transactions')}</h2>
        </div>
        <WithdrawRequestsCard onCreateWithdrawRequest={handleCreateWithdrawRequest} requests={WithdrawRequestsData} />
        <DataTable
          tag="transactions"
          translationPrefix="transaction"
          onDelete={undefined}
          showAddButton={false}
          showSelect={false}
          onBulkDelete={undefined}
          redirectToDetails={false}
          showAddTransactionButton={false}
          onRequestPickup={undefined}
          columns={UserTransactionColumns}
          data={transactionsData}
          showActions={false}
          showBulkDeleteButton={false}
          showCreatePickupButton={false}
        />
      </div>
    </div>
  );
}
