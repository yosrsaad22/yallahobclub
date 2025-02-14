'use client';
import { useEffect, useState } from 'react';
import {
  IconBuildingStore,
  IconBuildingWarehouse,
  IconCheck,
  IconCircleDashedCheck,
  IconCoin,
  IconCoinOff,
  IconCurrencyDollar,
  IconDiscount,
  IconDiscountOff,
  IconHourglassHigh,
  IconLoader2,
  IconMoneybag,
  IconPackage,
  IconPackageImport,
  IconSearch,
  IconShoppingCart,
  IconTruckDelivery,
  IconUserQuestion,
  IconUsers,
  IconX,
} from '@tabler/icons-react';
import { GraphIllustration1 } from '@/components/illustrations/graph1';
import { GraphIllustration2 } from '@/components/illustrations/graph2';
import { GraphIllustration3 } from '@/components/illustrations/graph3';
import { GraphIllustration4 } from '@/components/illustrations/graph4';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from './date-range-picker';
import { DateRange, AdminStats, ActionResponse, SellerStats } from '@/types';
import { RecentSales } from './recent-sales';
import { Button } from '@/components/ui/button';
import { ReturnRate } from './return-rate';
import { useTranslations } from 'next-intl';
import { DailyProfitAndSubOrdersChart } from './daily-profit-sub-orders';
import { MonthlyProfitAndSubOrdersChart } from './monthly-profit-sub-orders';
import { TopFifty } from './top-fifty';

interface SellerStatsProps extends React.HTMLAttributes<HTMLDivElement> {
  initialStats?: SellerStats;
  onRefetch: (range: DateRange) => Promise<ActionResponse>;
}

export function SellerStatsComponent({ initialStats, onRefetch }: SellerStatsProps) {
  const today = new Date();
  const defaultDateRange: DateRange = {
    from: new Date(today.setHours(0, 0, 0, 0)),
    to: null,
  };
  const tStats = useTranslations('dashboard.stats');

  const [stats, setStats] = useState<SellerStats | null>(initialStats || null);
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
        <DateRangePicker defaultDateRange={defaultDateRange} onChange={(range) => setDateRange(range)} />
        <Button disabled={isFetching} className="px-4" onClick={() => handleRefetch()} variant={'outline'}>
          {isFetching ? <IconLoader2 className="mr-2 h-5 w-5 animate-spin" /> : <IconCheck className="mr-2 h-5 w-5" />}
          Apply
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* first  row */}

        <Card className="max-h-[7rem]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="flex flex-col text-sm font-medium">
              {tStats('total-sub-orders')}
              <p className="text-xs text-muted-foreground">{tStats('excluding-cancelled')}</p>
            </CardTitle>
            <IconShoppingCart className="h-10 w-10 rounded-full bg-accent p-2 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mt-0 text-xl font-bold md:-mt-5 ">
              {isFetching ? (
                <IconLoader2 className="animate-spin text-muted-foreground" />
              ) : (
                (stats?.subOrders ?? 0) - (stats?.cancelledSubOrders ?? 0)
              )}
            </div>
          </CardContent>
        </Card>

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
            <CardTitle className="text-sm font-medium">{tStats('pending-sub-orders')}</CardTitle>
            <IconTruckDelivery className="h-10 w-10 rounded-full bg-accent p-2 text-foreground" />
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

        <Card className="max-h-[7rem] ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{tStats('returned-sub-orders')}</CardTitle>
            <IconPackageImport className="h-10 w-10 rounded-full bg-accent p-2 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mt-0 text-xl font-bold md:-mt-5">
              {isFetching ? (
                <IconLoader2 className="animate-spin text-muted-foreground" />
              ) : (
                stats?.returnedSubOrders || 0
              )}
            </div>
          </CardContent>
        </Card>

        {/* second row */}

        <Card className="max-h-[7rem] overflow-hidden">
          <CardHeader className="flex flex-col flex-wrap   items-start justify-start gap-0 space-y-0 pb-2 md:flex-row md:flex-nowrap md:items-center md:justify-between">
            <CardTitle className="text-sm font-medium">{tStats('seller-profit')}</CardTitle>
            <div className="text-lg font-bold">
              {isFetching ? (
                <IconLoader2 className="animate-spin text-muted-foreground" />
              ) : (
                `${stats?.sellersProfit || 0} TND`
              )}{' '}
            </div>
          </CardHeader>
          <CardContent className="mt-0 px-0 md:-mt-4">
            <GraphIllustration1 />
          </CardContent>
        </Card>

        <Card className="max-h-[7rem] overflow-hidden">
          <CardHeader className="flex flex-col flex-wrap   items-start justify-start gap-0 space-y-0 pb-2 md:flex-row md:flex-nowrap md:items-center md:justify-between">
            <CardTitle className="text-sm font-medium">{tStats('car')}</CardTitle>
            <div className="text-lg font-bold">
              {isFetching ? <IconLoader2 className="animate-spin text-muted-foreground" /> : `${stats?.car || 0} TND`}{' '}
            </div>
          </CardHeader>
          <CardContent className="mt-0 px-0 md:-mt-4">
            <GraphIllustration2 />
          </CardContent>
        </Card>

        <Card className="max-h-[7rem] overflow-hidden">
          <CardHeader className="flex flex-col flex-wrap   items-start justify-start gap-0 space-y-0 pb-2 md:flex-row md:flex-nowrap md:items-center md:justify-between">
            <CardTitle className="text-sm font-medium">{tStats('pending-profit')}</CardTitle>
            <div className="text-lg font-bold">
              {isFetching ? (
                <IconLoader2 className="animate-spin text-muted-foreground" />
              ) : (
                `${stats?.pendingProfit || 0} TND`
              )}
            </div>
          </CardHeader>
          <CardContent className="mt-0 px-0 md:-mt-4">
            <GraphIllustration3 />
          </CardContent>
        </Card>
        <Card className="max-h-[7rem] overflow-hidden">
          <CardHeader className="flex flex-col flex-wrap   items-start justify-start gap-0 space-y-0 pb-2 md:flex-row md:flex-nowrap md:items-center md:justify-between">
            <CardTitle className="text-sm font-medium">{tStats('return-penalties')}</CardTitle>
            <div className="text-lg font-bold">
              {isFetching ? (
                <IconLoader2 className="animate-spin text-muted-foreground" />
              ) : (
                `${(stats?.returnedSubOrders ?? 0) * 3} TND`
              )}
            </div>
          </CardHeader>
          <CardContent className="mt-0 px-0 md:-mt-4">
            <GraphIllustration4 />
          </CardContent>
        </Card>

        {/* Third row */}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <Card className="col-span-1  p-3 md:col-span-3 md:p-3">
          <TopFifty
            data={stats?.topFiftyProducts || []}
            dateRange={dateRange ?? defaultDateRange}
            isFetching={isFetching}
            title={tStats('seller-top-fifty-products-title')}
            description={tStats('seller-top-fifty-products-description')}
            noDataMessage={tStats('no-data')}
          />{' '}
        </Card>
        <Card className="col-span-1 p-3 md:col-span-2 md:p-3">
          <ReturnRate
            loading={isFetching}
            date={dateRange ?? defaultDateRange}
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
