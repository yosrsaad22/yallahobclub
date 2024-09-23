'use client';

import { Line, LineChart, ResponsiveContainer, YAxis, Tooltip, XAxis } from 'recharts';

const data = [
  {
    average: 400,
    today: 240,
  },
  {
    average: 300,
    today: 139,
  },
  {
    average: 200,
    today: 450,
  },
  {
    average: 278,
    today: 390,
  },
  {
    average: 189,
    today: 480,
  },
  {
    average: 239,
    today: 380,
  },
  {
    average: 349,
    today: 430,
  },
];

export function Revenue() {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          className="mt-8"
          data={data}
          margin={{
            top: 20,
            right: 0,
            left: 0,
            bottom: 0,
          }}>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Average</span>
                        <span className="font-bold text-muted-foreground">{payload[0].value}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Today</span>
                        <span className="font-bold">{payload[1].value}</span>
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            }}
          />
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Line
            type="monotone"
            strokeWidth={6}
            dataKey="average"
            activeDot={{
              r: 6,
              style: { fill: 'hsl(1,97%,61%)', opacity: 0.5 },
            }}
            style={
              {
                stroke: 'hsl(1,97%,61%)',
              } as React.CSSProperties
            }
          />
          <Line
            type="monotone"
            dataKey="today"
            strokeWidth={6}
            activeDot={{
              r: 8,
              style: {
                fill: 'hsl(182,63%,45%)',

                opacity: 0.5,
              },
            }}
            style={
              {
                stroke: 'hsl(182,63%,45%)',
              } as React.CSSProperties
            }
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
