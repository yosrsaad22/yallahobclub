'use client';
import { useEffect, useState } from 'react';
import {
  IconBuildingStore,
  IconBuildingWarehouse,
  IconCheck,
  IconCircleDashedCheck,
  IconCurrencyDollar,
  IconHourglassHigh,
  IconLoader2,
  IconPackage,
  IconPackageImport,
  IconSearch,
  IconTruckDelivery,
  IconUserQuestion,
  IconUsers,
} from '@tabler/icons-react';
import { GraphIllustration1 } from '@/components/illustrations/graph1';
import { GraphIllustration2 } from '@/components/illustrations/graph2';
import { GraphIllustration3 } from '@/components/illustrations/graph3';
import { GraphIllustration4 } from '@/components/illustrations/graph4';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from './date-range-picker';
import { DateRange, ActionResponse, SupplierStats } from '@/types';
import { Button } from '@/components/ui/button';
import { ReturnRate } from './return-rate';
import { useTranslations } from 'next-intl';
import { DailyProfitAndSubOrdersChart } from './daily-profit-sub-orders';
import { MonthlyProfitAndSubOrdersChart } from './monthly-profit-sub-orders';
import { TopTen } from './top-ten';

interface SupplierStatsProps extends React.HTMLAttributes<HTMLDivElement> {
  initialStats?: SupplierStats;
  onRefetch: (range: DateRange) => Promise<ActionResponse>;
}

export function SupplierStatsComponent({ initialStats, onRefetch }: SupplierStatsProps) {
  const defaultDateRange: DateRange = {
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  };
  const tStats = useTranslations('dashboard.stats');

  const [stats, setStats] = useState<SupplierStats | null>(initialStats || null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(defaultDateRange);

  const handleRefetch = async () => {
    setIsFetching(true);
    try {
      const statsRes = await onRefetch(dateRange ? dateRange : defaultDateRange);
      if (statsRes.error) {
        setStats(null);
      } else {
        setStats(statsRes.data);
      }
    } catch (error) {
      setStats(null);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row items-center justify-end gap-3">
        <DateRangePicker onChange={(range) => setDateRange(range)} />
        <Button disabled={isFetching} className="px-4" onClick={() => handleRefetch()} variant={'outline'}>
          {isFetching ? <IconLoader2 className="mr-2 h-5 w-5 animate-spin" /> : <IconCheck className="mr-2 h-5 w-5" />}
          Apply
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* first row */}
        <Card className="relative max-h-[7rem] flex-col overflow-hidden">
          <div className="absolute bottom-1 right-2 w-fit rounded-full border border-foreground px-2 text-xs text-foreground">
            {tStats('estimated')}
          </div>
          <CardHeader className="flex flex-col flex-wrap   items-start justify-start gap-0 space-y-0 pb-2 md:flex-row md:flex-nowrap md:items-center md:justify-between">
            <CardTitle className="text-sm font-medium">{tStats('sub-orders')}</CardTitle>
            <div className="text-lg font-bold">
              {isFetching ? <IconLoader2 className="animate-spin text-muted-foreground" /> : stats?.subOrders || 0}
            </div>
          </CardHeader>
          <CardContent className="mt-0 px-0 md:-mt-4">
            <GraphIllustration1 />
          </CardContent>
        </Card>
        <Card className="relative max-h-[7rem] flex-col overflow-hidden">
          <div className="absolute bottom-1 right-2 w-fit rounded-full border border-foreground px-2 text-xs text-foreground">
            {tStats('estimated')}
          </div>
          <CardHeader className="flex flex-col flex-wrap   items-start justify-start gap-0 space-y-0 pb-2 md:flex-row md:flex-nowrap md:items-center md:justify-between">
            <CardTitle className="text-sm font-medium">{tStats('supplier-profit')}</CardTitle>
            <div className="text-lg font-bold">
              {isFetching ? (
                <IconLoader2 className="animate-spin text-muted-foreground" />
              ) : (
                `${stats?.sellersProfit || 0} TND`
              )}
            </div>
          </CardHeader>
          <CardContent className="mt-0 px-0 md:-mt-4">
            <GraphIllustration4 />
          </CardContent>
        </Card>
        <Card className="max-h-[7rem] overflow-hidden">
          <CardHeader className="flex flex-col flex-wrap   items-start justify-start gap-0 space-y-0 pb-2 md:flex-row md:flex-nowrap md:items-center md:justify-between">
            <CardTitle className="text-sm font-medium">{tStats('pickups')}</CardTitle>
            <div className="text-lg font-bold">
              {isFetching ? <IconLoader2 className="animate-spin text-muted-foreground" /> : `${stats?.pickups || 0}`}
            </div>
          </CardHeader>
          <CardContent className="mt-0 px-0 md:-mt-4">
            <GraphIllustration3 />
          </CardContent>
        </Card>
        <Card className="max-h-[7rem] overflow-hidden">
          <CardHeader className="flex flex-col flex-wrap   items-start justify-start gap-0 space-y-0 pb-2 md:flex-row md:flex-nowrap md:items-center md:justify-between">
            <CardTitle className="text-sm font-medium">{tStats('transactions')}</CardTitle>
            <div className="text-lg font-bold">
              {isFetching ? <IconLoader2 className="animate-spin text-muted-foreground" /> : stats?.transactions || 0}
            </div>
          </CardHeader>
          <CardContent className="mt-0 px-0 md:-mt-4">
            <GraphIllustration2 />
          </CardContent>
        </Card>

        {/* second  row */}
        <Card className="max-h-[7rem]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{tStats('delivered-sub-orders')}</CardTitle>
            <IconCircleDashedCheck className="h-10 w-10 rounded-full bg-accent p-2 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mt-0 text-xl font-bold md:-mt-5 ">
              {isFetching ? (
                <IconLoader2 className="animate-spin text-muted-foreground" />
              ) : (
                stats?.completedSubOrders || 0
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="max-h-[7rem] ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{tStats('paid-sub-orders')}</CardTitle>
            <IconCurrencyDollar className="h-10 w-10 rounded-full bg-accent p-2 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mt-0 text-xl font-bold md:-mt-5">
              {isFetching ? <IconLoader2 className="animate-spin text-muted-foreground" /> : stats?.paidSubOrders || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="max-h-[7rem]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{tStats('pending-sub-orders')}</CardTitle>
            <IconHourglassHigh className="h-10 w-10 rounded-full bg-accent p-2 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mt-0 text-xl font-bold md:-mt-5">
              {isFetching ? (
                <IconLoader2 className="animate-spin text-muted-foreground" />
              ) : (
                stats?.pendingSubOrders || 0
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="max-h-[7rem]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{tStats('returned-sub-orders')}</CardTitle>
            <IconPackageImport className="h-10 w-10 rounded-full bg-accent p-2 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mt-0  text-xl font-bold md:-mt-5">
              {isFetching ? (
                <IconLoader2 className="animate-spin text-muted-foreground" />
              ) : (
                stats?.returnedSubOrders || 0
              )}
            </div>
          </CardContent>
        </Card>

        {/* third row */}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <Card className="col-span-1  p-3 md:col-span-3 md:p-3">
          <TopTen
            data={stats?.topFiveProducts || []}
            dateRange={dateRange!}
            isFetching={isFetching}
            title={tStats('seller-top-five-products-title')}
            description={tStats('seller-top-five-products-description')}
            noDataMessage={tStats('no-data')}
          />{' '}
        </Card>
        <Card className="col-span-1 p-3 md:col-span-2 md:p-3">
          <ReturnRate
            data={[
              { name: 'Delivered', value: stats?.completedSubOrders || 0 },
              { name: 'Returns', value: stats?.returnedSubOrders || 0 },
            ]}
          />
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        <Card className="col-span-1 p-3  md:col-span-3">
          <MonthlyProfitAndSubOrdersChart data={stats?.monthlyProfitAndSubOrders || []} />
        </Card>
        <Card className="col-span-1 p-3 md:col-span-3">
          <DailyProfitAndSubOrdersChart data={stats?.dailyProfitAndSubOrders || []} />
        </Card>
      </div>
    </div>
  );
}
