'use client';
import { useEffect, useState } from 'react';
import {
  IconBuildingStore,
  IconBuildingWarehouse,
  IconCheck,
  IconCircleDashedCheck,
  IconClockDollar,
  IconCoinOff,
  IconCurrencyDollar,
  IconHourglassHigh,
  IconLoader2,
  IconPackage,
  IconPackageImport,
  IconSearch,
  IconShoppingCartDiscount,
  IconTransactionDollar,
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
import { DateRange, AdminStats, ActionResponse } from '@/types';
import { RecentSales } from './recent-sales';
import { Button } from '@/components/ui/button';
import { ReturnRate } from './return-rate';
import { useTranslations } from 'next-intl';
import { DailyProfitAndSubOrdersChart } from './daily-profit-sub-orders';
import { MonthlyProfitAndSubOrdersChart } from './monthly-profit-sub-orders';
import { MonthlyProfitChart } from './monthly-profit';
import { DailyProfitChart } from './daily-profit';
import { MonthlySubOrdersAndCoursesChart } from './monthly-sub-orders-courses';
import { DailySubOrdersAndCoursesChart } from './daily-sub-orders-courses';
import { Badge } from '@/components/ui/badge';
import { TopFifty } from './top-fifty';

interface AdminStatsProps extends React.HTMLAttributes<HTMLDivElement> {
  initialStats?: AdminStats;
  onRefetch: (range: DateRange) => Promise<ActionResponse>;
}

export function AdminStatsComponent({ initialStats, onRefetch }: AdminStatsProps) {
  const today = new Date();
  const defaultDateRange: DateRange = {
    from: new Date(today.setHours(0, 0, 0, 0)),
    to: null,
  };

  const tStats = useTranslations('dashboard.stats');

  const [stats, setStats] = useState<AdminStats | null>(initialStats || null);
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
      <div className="flex flex-row flex-wrap items-center  justify-end gap-3">
        <DateRangePicker defaultDateRange={defaultDateRange} onChange={(range) => setDateRange(range)} />
        <Button disabled={isFetching} className="px-4" onClick={() => handleRefetch()} variant={'outline'}>
          {isFetching ? (
            <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <IconCheck className="mr-0 h-5 w-5 md:mr-2" />
          )}
          <p className="hidden md:block">{tStats('apply')}</p>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* first row */}
        <Card className="relative max-h-[7rem] flex-col overflow-hidden">
          <div className="absolute bottom-1 right-2 w-fit rounded-full  border-2 border-foreground px-2 text-sm font-semibold text-foreground">
            {tStats('total')}
          </div>
          <CardHeader className="flex flex-col flex-wrap   items-start justify-start gap-0 space-y-0 pb-2 md:flex-row md:flex-nowrap md:items-center md:justify-between">
            <CardTitle className="flex flex-col text-sm font-medium">
              {tStats('sub-orders')}
              <p className="text-xs text-muted-foreground">{tStats('excluding-cancelled')}</p>
            </CardTitle>
            <div className="text-lg font-bold">
              {isFetching ? (
                <IconLoader2 className="animate-spin text-muted-foreground" />
              ) : (
                (stats?.subOrders ?? 0) - (stats?.cancelledSubOrders ?? 0)
              )}
            </div>
          </CardHeader>
          <CardContent className="mt-0 px-0 md:-mt-4">
            <GraphIllustration1 />
          </CardContent>
        </Card>
        <Card className="relative max-h-[7rem] flex-col overflow-hidden">
          <div className="absolute bottom-1 right-2 w-fit rounded-full border-2 border-foreground px-2 text-sm font-semibold text-foreground">
            CAP
          </div>
          <CardHeader className="flex flex-col flex-wrap   items-start justify-start gap-0 space-y-0 pb-2 md:flex-row md:flex-nowrap md:items-center md:justify-between">
            <CardTitle className="text-sm font-medium">{tStats('cap')}</CardTitle>
            <div className="text-lg font-bold">
              {isFetching ? <IconLoader2 className="animate-spin text-muted-foreground" /> : `${stats?.cap || 0} TND`}
            </div>
          </CardHeader>
          <CardContent className="mt-0 px-0 md:-mt-4">
            <GraphIllustration4 />
          </CardContent>
        </Card>
        <Card className="relative max-h-[7rem] flex-col overflow-hidden">
          <div className="absolute bottom-1 right-2 w-fit rounded-full border-2 border-foreground px-2 text-sm font-semibold  text-foreground">
            CAR
          </div>
          <CardHeader className="flex flex-col flex-wrap   items-start justify-start gap-0 space-y-0 pb-2 md:flex-row md:flex-nowrap md:items-center md:justify-between">
            <CardTitle className="text-sm font-medium">{tStats('car')}</CardTitle>
            <div className="text-lg font-bold">
              {isFetching ? <IconLoader2 className="animate-spin text-muted-foreground" /> : `${stats?.car || 0} TND`}
            </div>
          </CardHeader>
          <CardContent className="mt-0 px-0 md:-mt-4">
            <GraphIllustration2 />
          </CardContent>
        </Card>
        <Card className="relative flex max-h-[7rem] flex-col overflow-hidden">
          <div className="absolute bottom-1 right-2 w-fit rounded-full border-2 border-foreground px-2 text-sm font-semibold  text-foreground">
            CAE
          </div>
          <CardHeader className="flex flex-col flex-wrap items-start   justify-start gap-0 space-y-0 pb-2  md:flex-row md:flex-nowrap md:items-center md:justify-between">
            <CardTitle className="text-sm font-medium">{tStats('cae')}</CardTitle>
            <div className="text-lg font-bold">
              {isFetching ? <IconLoader2 className="animate-spin text-muted-foreground" /> : `${stats?.cae || 0} TND`}
            </div>
          </CardHeader>
          <CardContent className="mt-0 px-0 md:-mt-4">
            <GraphIllustration3 />
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
        <Card className="max-h-[7rem] ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{tStats('cancelled-sub-orders')}</CardTitle>
            <IconX className="h-10 w-10 rounded-full bg-accent p-2 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mt-0 text-xl font-bold md:-mt-5">
              {isFetching ? (
                <IconLoader2 className="animate-spin text-muted-foreground" />
              ) : (
                stats?.cancelledSubOrders || 0
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

        <Card className="max-h-[7rem]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{tStats('average-cart')}</CardTitle>
            <IconShoppingCartDiscount className="h-10 w-10 rounded-full bg-accent p-2 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mt-0 text-xl font-bold md:-mt-5 ">
              {isFetching ? (
                <IconLoader2 className="animate-spin text-muted-foreground" />
              ) : stats?.car && stats?.completedSubOrders ? (
                (stats.car / stats.completedSubOrders).toFixed(2) + ' TND'
              ) : (
                0 + ' TND'
              )}{' '}
            </div>
          </CardContent>
        </Card>

        <Card className="max-h-[7rem]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{tStats('pending-revenue')}</CardTitle>
            <IconClockDollar className="h-10 w-10 rounded-full bg-accent p-2 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mt-0 text-xl font-bold md:-mt-5">
              {isFetching ? (
                <IconLoader2 className="animate-spin text-muted-foreground" />
              ) : (
                `${stats?.pendingRevenue || 0} TND`
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="max-h-[7rem] ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{tStats('cancelled-revenue')}</CardTitle>
            <IconCoinOff className="h-10 w-10 rounded-full bg-accent p-2 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mt-0 text-xl font-bold md:-mt-5">
              {isFetching ? (
                <IconLoader2 className="animate-spin text-muted-foreground" />
              ) : (
                `${stats?.cancelledRevenue || 0} TND`
              )}{' '}
            </div>
          </CardContent>
        </Card>
        <Card className="max-h-[7rem]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{tStats('returned-revenue')}</CardTitle>
            <IconTransactionDollar className="h-10 w-10 rounded-full bg-accent p-2 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mt-0  text-xl font-bold md:-mt-5">
              {isFetching ? (
                <IconLoader2 className="animate-spin text-muted-foreground" />
              ) : (
                `${stats?.returnedRevenue || 0} TND`
              )}{' '}
            </div>
          </CardContent>
        </Card>

        {/* fourth row */}

        <Card className="relative max-h-[7rem]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{tStats('sellers')}</CardTitle>
            <IconUsers className="h-10 w-10 rounded-full bg-accent p-2 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mt-0 text-xl font-bold md:-mt-5 ">{stats?.sellers || 0}</div>
            <div className="absolute bottom-2 right-2 w-fit rounded-full border-2 border-success px-2 text-sm font-semibold text-success">
              {stats?.sellersBalance.toFixed(2) || 0} TND
            </div>
          </CardContent>
        </Card>
        <Card className="relative max-h-[7rem]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{tStats('suppliers')}</CardTitle>
            <IconBuildingWarehouse className="h-10 w-10 rounded-full bg-accent p-2 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mt-0  text-xl font-bold md:-mt-5">{stats?.suppliers || 0}</div>
            <div className="absolute bottom-2 right-2 w-fit rounded-full border-2 border-success px-2 text-sm font-semibold text-success">
              {stats?.suppliersBalance.toFixed(2) || 0} TND
            </div>
          </CardContent>
        </Card>
        <Card className="max-h-[7rem]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{tStats('products')}</CardTitle>
            <IconPackage className="h-10 w-10 rounded-full bg-accent p-2 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mt-0 text-xl font-bold md:-mt-5">{stats?.products || 0}</div>
          </CardContent>
        </Card>
        <Card className="max-h-[7rem] ">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{tStats('leads')}</CardTitle>
            <IconUserQuestion className="h-10 w-10 rounded-full bg-accent p-2 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mt-0 text-xl font-bold md:-mt-5">{stats?.leads || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* fifth and sixth row */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        <Card className="col-span-1  p-3 md:col-span-2 md:p-3">
          <TopFifty
            data={stats?.topFiftyProducts || []}
            dateRange={dateRange ?? defaultDateRange}
            isFetching={isFetching}
            title={tStats('top-fifty-products-title')}
            description={tStats('top-fifty-products-description')}
            noDataMessage={tStats('no-data')}
          />{' '}
        </Card>
        <Card className="col-span-1  p-3 md:col-span-2 md:p-3">
          <TopFifty
            data={stats?.topFiftySellers || []}
            dateRange={dateRange ?? defaultDateRange}
            isFetching={isFetching}
            title={tStats('top-fifty-sellers-title')}
            description={tStats('top-fifty-sellers-description')}
            noDataMessage={tStats('no-data')}
            useAvatars
          />{' '}
        </Card>
        <Card className="col-span-1 p-3 md:col-span-2 md:p-3">
          <ReturnRate
            date={dateRange ?? defaultDateRange}
            loading={isFetching}
            data={[
              { name: 'Delivered', value: stats?.completedSubOrders || 0 },
              { name: 'Returns', value: stats?.returnedSubOrders || 0 },
            ]}
          />
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        <Card className="col-span-1 p-3  md:col-span-3">
          <MonthlySubOrdersAndCoursesChart data={stats?.monthlyProfit || []} />
        </Card>
        <Card className="col-span-1 p-3 md:col-span-3">
          <DailySubOrdersAndCoursesChart data={stats?.dailyProfit || []} />
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        <Card className="col-span-1 p-3  md:col-span-3">
          <MonthlyProfitChart data={stats?.monthlyProfit || []} />
        </Card>
        <Card className="col-span-1 p-3 md:col-span-3">
          <DailyProfitChart data={stats?.dailyProfit || []} />
        </Card>
      </div>
    </div>
  );
}
