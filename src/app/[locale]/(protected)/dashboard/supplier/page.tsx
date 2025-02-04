import { sellerGetStats, supplierGetStats } from '@/actions/stats';
import { SellerStatsComponent } from '@/components/dashboard/stats/seller-stats';
import { SupplierStatsComponent } from '@/components/dashboard/stats/supplier-stats';
import { ActionResponse, AdminStats, DateRange } from '@/types';
import { IconLayoutDashboard } from '@tabler/icons-react';
import { getTranslations } from 'next-intl/server';

export default async function SupplierHome() {
  const t = await getTranslations('dashboard');

  const res: ActionResponse = await supplierGetStats({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  });
  const statsData = res.error ? [] : res.data;

  const handleRefetch = async (range: DateRange) => {
    'use server';
    const res = await supplierGetStats({
      from: range.from || undefined,
      to: range.to || undefined,
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
        <SupplierStatsComponent initialStats={statsData} onRefetch={handleRefetch} />
      </div>
    </div>
  );
}
