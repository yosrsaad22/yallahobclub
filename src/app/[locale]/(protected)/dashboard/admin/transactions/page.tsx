import { DataTable } from '@/components/dashboard/table/data-table';
import Breadcrumb from '@/components/ui/breadcrumb';
import { ActionResponse, DataTableUser } from '@/types';
import { IconReceipt2, IconShoppingCart } from '@tabler/icons-react';
import React from 'react';
import { getTranslations } from 'next-intl/server';

import {
  approveWithdrawRequest,
  createTransaction,
  createWithdrawRequest,
  declineWithdrawRequest,
  getTransactions,
  getWithdrawRequests,
} from '@/actions/transactions';
import { Transaction, WithdrawRequest } from '@prisma/client';
import { requestPickup } from '@/actions/pickups';
import { AdminTransactionColumns } from '@/components/dashboard/table/columns/transaction-columns';
import { WithdrawRequestsCard } from '@/components/dashboard/cards/withdraw-requests-card';

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

  const transactionsRes: ActionResponse = await getTransactions();
  const transactionsData: any[] = transactionsRes.error ? [] : transactionsRes.data;

  const WithdrawRequestsRes: ActionResponse = await getWithdrawRequests();
  const WithdrawRequestsData: (WithdrawRequest & { user: DataTableUser })[] = WithdrawRequestsRes.error
    ? []
    : WithdrawRequestsRes.data;

  const handleAddTransaction = async (userId: string, amount: string) => {
    'use server';
    const res = await createTransaction(userId, 'admin-transaction', parseFloat(amount));
    return res;
  };

  const handleApproveWithdrawRequest = async (id: string) => {
    'use server';
    const res = await approveWithdrawRequest(id);
    return res;
  };

  const handleDeclineWithdrawRequest = async (id: string) => {
    'use server';
    const res = await declineWithdrawRequest(id);
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
        <WithdrawRequestsCard
          onApproveWithdrawRequest={handleApproveWithdrawRequest}
          onDeclineWithdrawRequest={handleDeclineWithdrawRequest}
          requests={WithdrawRequestsData}
        />
        <DataTable
          tag="transactions"
          translationPrefix="transaction"
          onDelete={undefined}
          showAddButton={false}
          showSelect={false}
          onAddTransaction={handleAddTransaction}
          onBulkDelete={undefined}
          redirectToDetails={false}
          showAddTransactionButton={true}
          onRequestPickup={undefined}
          columns={AdminTransactionColumns}
          data={transactionsData}
          showActions={false}
          showBulkDeleteButton={false}
          showCreatePickupButton={false}
        />
      </div>
    </div>
  );
}
