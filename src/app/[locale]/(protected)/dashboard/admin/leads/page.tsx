import { DataTable } from '@/components/dashboard/table/data-table';
import Breadcrumb from '@/components/ui/breadcrumb';
import { ActionResponse, DataTableLead, DataTableUser } from '@/types';
import { IconUsers } from '@tabler/icons-react';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import { LeadColumns } from '@/components/dashboard/table/columns/leads-columns';
import { bulkDeleteLeads, getLeads } from '@/actions/leads';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return {
    title: 'Ecomness - ' + t('pages.leads'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export default async function Leads() {
  const t = await getTranslations('dashboard');
  const breadcrumbItems = [{ title: t('pages.leads'), link: '/dashboard/admin/leads' }];
  const res: ActionResponse = await getLeads();
  const leadsData: DataTableLead[] = res.error ? [] : res.data;

  const handleBulkDelete = async (ids: string[]) => {
    'use server';
    const res = await bulkDeleteLeads(ids);
    return res;
  };

  return (
    <div className="w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center space-x-2 text-3xl font-bold">
          <IconUsers className="h-7 w-7" />
          <h2 className="tracking-tight">{t('pages.leads')}</h2>
        </div>
        <DataTable
          translationPrefix="lead"
          onBulkDelete={handleBulkDelete}
          tag="leads"
          redirectToDetails={false}
          showActions={false}
          showAddButton={false}
          columns={LeadColumns}
          data={leadsData}
          onDelete={undefined}
        />
      </div>
    </div>
  );
}
