'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { MonthlyProfit } from '@/types';
import { IconCalendar, IconInfinity } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { LineChart, CartesianGrid, XAxis, YAxis, Line, Legend } from 'recharts';

interface MonthlySubOrdersAndCoursesProps {
  data: MonthlyProfit[];
}

// Chart Configuration
const chartConfig: ChartConfig = {
  subOrders: {
    label: 'SubOrders',
    color: 'hsl(var(--chart-1)/80%)',
  },
  soldCourses: {
    label: 'SoldCourses',
    color: 'hsl(var(--chart-2)/80%)',
  },
};

export function MonthlySubOrdersAndCoursesChart({ data }: MonthlySubOrdersAndCoursesProps) {
  const tStats = useTranslations('dashboard.stats');
  // Tooltip Renderer
  const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="grid min-w-[11rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
        <div className="font-medium">{label}</div>
        {payload.map((item: any) => (
          <div key={item.dataKey} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: chartConfig[item.dataKey]?.color || item.color }}
              />
              {tStats(item.dataKey)}
            </div>
            <span className="font-mono font-medium text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader className="p-3">
        <CardTitle>
          <div className="flex flex-col justify-start gap-1">
            <span className="flex items-center gap-1 text-sm  font-medium text-secondary">
              <IconCalendar className="h-5 w-5 text-secondary" />
              {tStats('last-6-months')}
            </span>{' '}
            {tStats('monthly-sub-orders-courses-title')}{' '}
          </div>
        </CardTitle>
        <CardDescription>{tStats('monthly-sub-orders-courses-description')}</CardDescription>
      </CardHeader>
      <CardContent className="p-3">
        {data.length === 0 ? (
          <div className="flex min-h-[325px] items-center justify-center">
            <span className="text-muted-foreground">{tStats('no-data')}</span>
          </div>
        ) : (
          <ChartContainer className=" -ml-8 " config={chartConfig}>
            <LineChart
              className="pt-4"
              data={data}
              margin={{
                left: 12,
                top: 6,
                right: 12,
              }}>
              <CartesianGrid className="" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)} // Short month name
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toLocaleString()} // Format numbers
              />
              <ChartTooltip cursor={true} content={<CustomTooltipContent />} />
              <Legend
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value: keyof typeof chartConfig) => (
                  <span style={{ color: chartConfig[value]?.color }}>{tStats(value)}</span>
                )}
              />
              <Line dataKey="subOrders" type="monotone" stroke={chartConfig.subOrders.color} strokeWidth={5} />
              <Line dataKey="soldCourses" type="monotone" stroke={chartConfig.soldCourses.color} strokeWidth={5} />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
