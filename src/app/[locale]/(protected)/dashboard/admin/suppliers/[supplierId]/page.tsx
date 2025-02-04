import Breadcrumb from '@/components/ui/breadcrumb';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import { getUser } from '@/actions/users';
import { DataTableUser } from '@/types';
import NotFound from '@/app/[locale]/[...not_found]/page';
import { EditUserForm } from '@/components/dashboard/forms/edit-user-form';
import { IconBuildingWarehouse } from '@tabler/icons-react';

interface SupplierDetailsProps {
  params: { supplierId: string };
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return {
    title: 'Ecomness - ' + t('pages.supplier-details'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export default async function SupplierDetails({ params }: SupplierDetailsProps) {
  const t = await getTranslations('dashboard');
  const breadcrumbItems = [
    { title: t('pages.suppliers'), link: '/dashboard/admin/suppliers' },
    { title: t('pages.supplier-details'), link: '/#' },
  ];

  const res = await getUser(params.supplierId);
  if (res.error) {
    return NotFound();
  }
  const supplierData: DataTableUser = res.error ? null : res.data;

  return (
    <div className="w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex flex-row items-center space-x-2 text-3xl font-bold">
          <IconBuildingWarehouse className="h-7 w-7" />
          <h2 className="tracking-tight">{t('pages.supplier-details')}</h2>
        </div>
        <EditUserForm userData={supplierData} />
      </div>
    </div>
  );
}
