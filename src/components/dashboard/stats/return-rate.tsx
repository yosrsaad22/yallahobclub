'use client';

import * as React from 'react';
import { Pie, PieChart, Legend, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartStyle } from '@/components/ui/chart';
import { useTranslations } from 'next-intl';
import { IconInfinity } from '@tabler/icons-react';

interface ReturnRateProps {
  data: { name: string; value: number }[];
}

// Define the configuration for the chart
const chartConfig: ChartConfig = {
  delivered: {
    label: 'delivered',
    color: 'hsl(var(--chart-1)/100%)',
  },
  returns: {
    label: 'returns',
    color: 'hsl(var(--chart-2)/100%)',
  },
};

export function ReturnRate({ data }: ReturnRateProps) {
  const tStats = useTranslations('dashboard.stats');

  // Calculate the total and return rate
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const returns = data.find((item) => item.name.toLowerCase() === 'returns')?.value || 0;
  const returnRate = total > 0 ? ((returns / total) * 100).toFixed(2) : '0.0';

  // Generate colors dynamically based on config
  const COLORS = data.map((item) => chartConfig[item.name.toLowerCase() as keyof typeof chartConfig]?.color);

  return (
    <Card className="flex h-full flex-col">
      {/* Add ChartStyle for styling */}
      <ChartStyle id="return-rate-pie" config={chartConfig} />
      <CardHeader className="p-3">
        <CardTitle>
          <div className="grid gap-1">
            <div className="flex flex-col justify-start gap-1">
              <span className="flex items-center gap-1 text-sm  font-medium text-secondary">
                <IconInfinity className=" text-secondary" />
                {tStats('all-time')}
              </span>{' '}
              {tStats('return-rate-title')}{' '}
            </div>
          </div>
        </CardTitle>
        <CardDescription>{tStats('return-rate-description')}</CardDescription>
      </CardHeader>
      <CardContent className="relative -mt-4 flex min-h-[320px] flex-1 justify-center p-3 pb-4">
        {data[0].value === 0 && data[1].value === 0 ? (
          <div className="flex items-center  justify-center text-muted-foreground">
            <span className="text-muted-foreground">{tStats('no-data')}</span>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 -mt-5 flex flex-col items-center justify-center text-center">
              <div className="text-3xl font-bold text-foreground">{`${returnRate}%`}</div>
              <div className="text-muted-foreground">{tStats('return-rate')}</div>
            </div>
            <ChartContainer id="return-rate-pie" config={chartConfig} className="mx-auto  w-full">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => (
                        <div className="flex w-full flex-row items-center justify-between ">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3"
                              style={{
                                backgroundColor:
                                  chartConfig[name.toString().toLowerCase() as keyof typeof chartConfig]?.color,
                              }}></div>
                            {tStats(name.toString().toLowerCase())}
                          </div>
                          <span>{value}</span>
                        </div>
                      )}
                    />
                  }
                />

                {/* Pie Chart */}
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`${(COLORS[index % COLORS.length] || 'hsl(var(--foreground)/90%)').replace('/100%', '/70%')}`}
                      stroke={COLORS[index % COLORS.length]} // Stroke color
                      strokeWidth={2} // Stroke width
                    />
                  ))}
                </Pie>

                {/* Legend */}
                <Legend
                  formatter={(value: string) => {
                    const key = value.toLowerCase() as keyof typeof chartConfig; // Match legend with chartConfig
                    const color = chartConfig[key]?.color || 'var(--foreground)'; // Default color if not found
                    return (
                      <span className="text-sm" style={{ color }}>
                        {tStats(key)}
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ChartContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
}
