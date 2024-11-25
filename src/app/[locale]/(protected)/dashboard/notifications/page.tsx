import React from 'react';
import { getTranslations } from 'next-intl/server';
import Breadcrumb from '@/components/ui/breadcrumb';
import { IconBell } from '@tabler/icons-react';
import { NotificationsCard } from '@/components/dashboard/cards/notifications-card';
import { deleteNotificationById, getNotifications } from '@/actions/notifications';
import { getNotificationsByUserId } from '@/data/notification';
import { currentUser } from '@/lib/auth';
import { ActionResponse } from '@/types';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return {
    title: 'Ecomness - ' + t('pages.notifications'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce', 'Marketplace'],
  };
}

export default async function Notifications() {
  const t = await getTranslations('dashboard');
  const breadcrumbItems = [{ title: t('pages.notifications'), link: '/dashboard/notifications' }];
  const user = await currentUser();

  const res = await getNotifications(user?.id!);
  const notifications = res.error ? [] : res.data;

  const handleDeleteNotification = async (id: string) => {
    'use server';
    const res = await deleteNotificationById(id);
    return res;
  };

  return (
    <div className="w-full space-y-4">
      <Breadcrumb items={breadcrumbItems} />
      <div className="flex items-center space-x-2 text-3xl font-bold">
        <IconBell className="h-7 w-7" />
        <h2 className="tracking-tight">{t('pages.notifications')}</h2>
      </div>
      <NotificationsCard notifications={notifications} onDeleteNotification={handleDeleteNotification} />
    </div>
  );
}
