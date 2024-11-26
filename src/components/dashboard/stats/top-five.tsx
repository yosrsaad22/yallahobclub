'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MEDIA_HOSTNAME } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import { DateRange, TopFiveItem } from '@/types';
import { IconCalendar, IconLoader2, IconUser } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

interface TopFiveProps {
  data: TopFiveItem[];
  dateRange: DateRange;
  isFetching: boolean;
  title: string;
  description: string;
  noDataMessage: string;
  useAvatars?: boolean;
}

export function TopFive({
  data,
  dateRange,
  isFetching,
  title,
  description,
  noDataMessage,
  useAvatars = false,
}: TopFiveProps) {
  return (
    <Card className="h-full">
      <CardHeader className="p-3">
        <CardTitle>
          <div className="flex flex-col justify-center  gap-2">
            <div className="flex flex-row items-center gap-1 font-medium">
              <IconCalendar className="h-5 w-5 text-secondary" />

              <div className="flex w-min items-center justify-start gap-2  text-secondary">
                <span className="text-sm ">{formatDate(dateRange.from!, false)}</span>

                {dateRange.to ? (
                  <div className="flex items-center gap-1">
                    <span className=" text-sm ">-</span>
                    <span className="text-sm  "> {formatDate(dateRange.to!, false)}</span>
                  </div>
                ) : null}
              </div>
            </div>
            {title}
          </div>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-3">
        {isFetching ? (
          <div className="flex min-h-[350px] w-full items-center justify-center">
            <IconLoader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : data.length === 0 ? (
          <div className="flex min-h-[350px] w-full items-center justify-center">
            <span className="text-muted-foreground">{noDataMessage}</span>
          </div>
        ) : (
          <ul className="w-full space-y-2 p-3">
            {data.map((item, index) => (
              <li
                key={item.id}
                className=" flex items-center gap-2 rounded-lg border p-2 text-lg duration-200 ease-in-out hover:scale-105 hover:shadow-md ">
                <div className="h-14 w-14">
                  {useAvatars ? (
                    <div className="flex h-full w-full items-center justify-center">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          className="object-cover"
                          src={`${MEDIA_HOSTNAME}${item.media}`}
                          alt={item.name[0] ?? ''}
                        />
                        <AvatarFallback>
                          <IconUser className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  ) : (
                    <Image
                      src={`${MEDIA_HOSTNAME}${item.media}`}
                      alt={item.name}
                      width={56}
                      height={56}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-row items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">#{index + 1}</p>
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                    </div>
                    <p className="text-md pr-2 font-medium text-foreground">{item.totalQuantity}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
