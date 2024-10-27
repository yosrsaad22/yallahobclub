import Breadcrumb from '@/components/ui/breadcrumb';
import { IconUsers } from '@tabler/icons-react';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import { AddUserForm } from '@/components/dashboard/forms/add-user-form';
import { roleOptions } from '@/lib/constants';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return {
    title: 'Ecomness - ' + t('pages.seller-add'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export default async function SellerAdd() {
  const t = await getTranslations('dashboard');
  const breadcrumbItems = [
    { title: t('pages.sellers'), link: '/dashboard/admin/sellers' },
    { title: t('pages.seller-add'), link: '/#' },
  ];

  return (
    <div className="w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center space-x-2 text-3xl font-bold">
          <IconUsers className="h-7 w-7" />
          <h2 className="tracking-tight">{t('pages.seller-add')}</h2>
        </div>
        <AddUserForm defaultRole={roleOptions.SELLER} />
      </div>
    </div>
  );
}
