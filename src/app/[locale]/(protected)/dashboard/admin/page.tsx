import { Overview } from '@/components/dashboard/admin/home/overview';
import { RecentSales } from '@/components/dashboard/admin/home/recent-sales';
import { Revenue } from '@/components/dashboard/admin/home/revenue';
import { GraphIllustration1 } from '@/components/illustrations/graph1';
import { GraphIllustration2 } from '@/components/illustrations/graph2';
import { GraphIllustration3 } from '@/components/illustrations/graph3';
import { GraphIllustration4 } from '@/components/illustrations/graph4';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  IconBuildingStore,
  IconBuildingWarehouse,
  IconLayoutDashboard,
  IconPackage,
  IconUsers,
} from '@tabler/icons-react';
import { getTranslations } from 'next-intl/server';

export default async function Admin() {
  const t = await getTranslations('dashboard');

  return (
    <div className="">
      <div className="flex-1 space-y-4 p-4 pt-6 lg:p-6">
        <div className="flex items-center space-x-2 text-3xl font-bold">
          <IconLayoutDashboard className="h-7 w-7" />
          <h2 className="tracking-tight">{t('pages.dashboard')}</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="max-h-[9.6rem]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Total Revenue</CardTitle>
              <div className="text-2xl font-bold">$45,231</div>
            </CardHeader>
            <CardContent className="px-0">
              <GraphIllustration1 />
            </CardContent>
          </Card>
          <Card className="max-h-[9.6rem]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Leads</CardTitle>
              <div className="text-2xl font-bold">+2350</div>
            </CardHeader>
            <CardContent className="px-0">
              <GraphIllustration4 />
            </CardContent>
          </Card>
          <Card className="max-h-[9.6rem]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Sales</CardTitle>
              <div className="text-2xl font-bold">+12,234</div>
            </CardHeader>
            <CardContent className="px-0">
              <GraphIllustration2 />
            </CardContent>
          </Card>
          <Card className="max-h-[9.6rem]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Orders</CardTitle>
              <div className="text-2xl font-bold">+573</div>
            </CardHeader>
            <CardContent className="px-0">
              <GraphIllustration3 />
            </CardContent>
          </Card>
          <Card className="max-h-[9.6rem]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Sellers</CardTitle>
              <IconUsers className="h-12 w-12 rounded-full bg-accent p-2 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">450</div>
              <p className="text-sm text-success ">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card className="max-h-[9.6rem]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Suppliers</CardTitle>
              <IconBuildingWarehouse className="h-12 w-12 rounded-full bg-accent p-2 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">40</div>
              <p className="text-sm text-destructive ">-80.1% from last month</p>
            </CardContent>
          </Card>
          <Card className=" ">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Products</CardTitle>
              <IconPackage className="h-12 w-12 rounded-full bg-accent p-2 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+234</div>
              <p className="text-sm text-success ">+19% from last month</p>
            </CardContent>
          </Card>
          <Card className=" ">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Stores</CardTitle>
              <IconBuildingStore className="h-12 w-12 rounded-full bg-accent p-2 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100</div>
              <p className="text-sm text-destructive ">-30 from last month</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-4 lg:col-span-3">
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Revenue />
            </CardContent>
          </Card>
          <Card className="col-span-4 lg:col-span-7">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>You made 265 sales this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
