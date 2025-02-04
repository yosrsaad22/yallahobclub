import { UserSettingsForm } from '@/components/dashboard/forms/user-settings-form';
import Breadcrumb from '@/components/ui/breadcrumb';
import { IconSettings } from '@tabler/icons-react';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return {
    title: 'Ecomness - ' + t('pages.settings'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export default async function SupplierSettings() {
  const t = await getTranslations('dashboard');
  const breadcrumbItems = [{ title: t('pages.settings'), link: '/dashboard/settings' }];

  return (
    <div className="w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex flex-row items-center space-x-2 text-3xl font-bold">
          <IconSettings className="h-7 w-7" />
          <h2 className=" text-3xl font-bold tracking-tight">{t('pages.settings')}</h2>
        </div>
        <UserSettingsForm />
      </div>
    </div>
  );
}
