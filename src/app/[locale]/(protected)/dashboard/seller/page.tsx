import { adminGetStats, sellerGetStats } from '@/actions/stats';
import { AdminStatsComponent } from '@/components/dashboard/stats/admin-stats';
import { SellerStatsComponent } from '@/components/dashboard/stats/seller-stats';
import { ActionResponse, AdminStats, DateRange } from '@/types';
import { IconLayoutDashboard } from '@tabler/icons-react';
import { getTranslations } from 'next-intl/server';

export default async function SellerHome() {
  const t = await getTranslations('dashboard');

  const res: ActionResponse = await sellerGetStats();
  const statsData = res.error ? [] : res.data;

  const handleRefetch = async (range: DateRange) => {
    'use server';
    const res = await sellerGetStats({
      from: range.from,
      to: range.to,
    });
    return res;
  };

  return (
    <div className="">
      <div className="flex-1 space-y-4 p-4 pt-6 lg:p-6">
        <div className="flex items-center space-x-2 text-3xl font-bold">
          <IconLayoutDashboard className="h-7 w-7" />
          <h2 className="tracking-tight">{t('pages.dashboard')}</h2>
        </div>
        <SellerStatsComponent initialStats={statsData} onRefetch={handleRefetch} />
      </div>
    </div>
  );
}
