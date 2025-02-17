import { adminGetStats } from '@/actions/stats';
import { AdminStatsComponent } from '@/components/dashboard/stats/admin-stats';
import { ActionResponse, AdminStats, DateRange } from '@/types';
import { IconLayoutDashboard } from '@tabler/icons-react';
import { getTranslations } from 'next-intl/server';

export default async function AdminHome() {
  const t = await getTranslations('dashboard');

  const res: ActionResponse = await adminGetStats();
  const statsData = res.error ? [] : res.data;

  const handleRefetch = async (range: DateRange) => {
    'use server';
    const res = await adminGetStats({
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
        <AdminStatsComponent initialStats={statsData} onRefetch={handleRefetch} />
      </div>
    </div>
  );
}
