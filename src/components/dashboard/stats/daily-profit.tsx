'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useTranslations } from 'next-intl';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';
import { DailyProfit } from '@/types';
import { IconCalendar, IconInfinity } from '@tabler/icons-react';

interface DailyProfitProps {
  data: DailyProfit[];
}

const chartConfig: ChartConfig = {
  profit: {
    label: 'Profit',
    color: 'hsl(var(--chart-2)/100%)',
  },
} satisfies ChartConfig;

export function DailyProfitChart({ data }: DailyProfitProps) {
  const tStats = useTranslations('dashboard.stats');

  const CustomTooltipContent = ({ active, payload }: any) => {
    if (!active || !payload || payload.length === 0) {
      return null;
    }

    const date = new Date(payload[0].payload.date);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`; // Format as "day/month"

    return (
      <div className="w-[150px] rounded border border-border bg-background p-2 shadow-lg">
        {/* Formatted Date */}
        <div className="mb-1 font-medium">{formattedDate}</div>
        {payload.map((item: any) => (
          <div key={item.dataKey} className="mb-1 flex items-center justify-between">
            {/* Colored Indicator */}
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: chartConfig[item.dataKey]?.color || item.color,
                }}
              />
              {tStats(item.dataKey)}
            </div>
            {/* Value with TND for profit */}
            <span className="font-mono font-medium text-foreground">
              {item.dataKey === 'profit' ? `${item.value.toLocaleString()} TND` : item.value}
            </span>
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
              {tStats('last-10-days')}
            </span>
            {tStats('daily-profit-title')}
          </div>
        </CardTitle>
        <CardDescription>{tStats('daily-profit-description')}</CardDescription>
      </CardHeader>
      <CardContent className=" p-3">
        {data.length === 0 ? (
          <div className="flex h-full  min-h-[200px] w-full items-center justify-center">
            <span className="text-muted-foreground">{tStats('no-data')}</span>
          </div>
        ) : (
          <ChartContainer className="-ml-5" config={chartConfig}>
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    const day = date.getDate();
                    const month = date.getMonth() + 1; // Months are 0-indexed
                    return `${day}/${month}`;
                  }}
                />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value.toLocaleString()}`} />
                <Tooltip content={<CustomTooltipContent />} />

                <Legend
                  wrapperStyle={{ paddingTop: '10px' }}
                  formatter={(value: keyof typeof chartConfig) => (
                    <span style={{ color: chartConfig[value]?.color }}>{tStats(value)}</span>
                  )}
                />
                {/* Bars with gradient fill */}
                <Bar
                  dataKey="profit"
                  fill={`${chartConfig.profit.color!.replace('/100%', '/70%')}`}
                  stroke={chartConfig.profit.color}
                  strokeWidth={2}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
