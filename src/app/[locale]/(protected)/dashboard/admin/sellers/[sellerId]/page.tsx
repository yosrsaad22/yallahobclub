import Breadcrumb from '@/components/ui/breadcrumb';
import { IconUsers } from '@tabler/icons-react';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import { getUser } from '@/actions/users';
import { DataTableUser } from '@/types';
import NotFound from '@/app/[locale]/[...not_found]/page';
import { EditUserForm } from '@/components/dashboard/forms/edit-user-form';

interface SellerDetailsProps {
  params: { sellerId: string };
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return {
    title: 'Ecomness - ' + t('pages.seller-details'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export default async function SellerDetails({ params }: SellerDetailsProps) {
  const t = await getTranslations('dashboard');
  const breadcrumbItems = [
    { title: t('pages.sellers'), link: '/dashboard/admin/sellers' },
    { title: t('pages.seller-details'), link: '/#' },
  ];

  const res = await getUser(params.sellerId);
  if (res.error) {
    return NotFound();
  }
  const sellerData: DataTableUser = res.error ? null : res.data;

  return (
    <div className="w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex flex-row items-center space-x-2 text-3xl font-bold">
          <IconUsers className="h-7 w-7" />
          <h2 className="tracking-tight">{t('pages.seller-details')}</h2>
        </div>
        <EditUserForm userData={sellerData} />
      </div>
    </div>
  );
}
