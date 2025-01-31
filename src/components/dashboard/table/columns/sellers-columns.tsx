'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MEDIA_HOSTNAME } from '@/lib/constants';
import { IconCircleCheck, IconCircleX, IconUser } from '@tabler/icons-react';
import { ColumnDef, RowData } from '@tanstack/react-table';
import { DataTableUser } from '@/types';
import { formatDate } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    columnName: string;
  }
}

const BooleanCell = ({ value, trueText, falseText }: { value: boolean; trueText: string; falseText: string }) => {
  const tFields = useTranslations('fields');
  if (!value) {
    return (
      <div className="flex w-[100px] items-center justify-start">
        <Badge className="text-md px-3 py-1 font-normal" variant={'destructive'}>
          {tFields(falseText)}
        </Badge>
      </div>
    );
  }
  return (
    <div className="flex w-[100px] items-center justify-start">
      <Badge className="text-md px-3 py-1 font-normal" variant={'success'}>
        {tFields(trueText)}
      </Badge>
    </div>
  );
};

export const SellerColumns: ColumnDef<DataTableUser & { returnRate: number }>[] = [
  {
    id: 'image',
    meta: {
      columnName: 'Image',
    },
    enableSorting: false,
    cell: ({ row }) => {
      const image = row.getValue<string | null>('image');
      const fullName = row.getValue<string>('fullName');
      return (
        <div className="w-[50px]">
          <Avatar className="h-9 w-9">
            <AvatarImage className="object-cover" src={`${MEDIA_HOSTNAME}${image}`} alt={fullName[0] ?? ''} />
            <AvatarFallback>
              {' '}
              <IconUser className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      );
    },
  },
  {
    accessorKey: 'code',
    meta: {
      columnName: 'code',
    },
  },
  {
    accessorKey: 'fullName',
    meta: {
      columnName: 'Fullname',
    },
  },

  {
    accessorKey: 'number',
    enableSorting: false,
    meta: {
      columnName: 'Number',
    },
  },
  {
    accessorKey: 'email',
    meta: {
      columnName: 'E-mail',
    },
  },

  {
    accessorKey: 'pack',
    meta: {
      columnName: 'Pack',
    },
  },
  {
    accessorKey: 'balance',
    meta: {
      columnName: 'balance',
    },
    cell: ({ row }) => {
      const balance: number = row.getValue('balance');
      return (
        <div className="">
          <p className={` font-semibold ${balance >= 0 ? 'text-success' : 'text-destructive'}`}>
            {balance.toFixed(2)} TND
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'returnRate',
    meta: {
      columnName: 'returnRate',
    },
    cell: ({ row }) => {
      const returnRate: number = row.getValue('returnRate');
      return (
        <div className="flex w-full justify-center">
          <p className={` font-semibold`}>{returnRate.toFixed(0)} %</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'active',
    meta: {
      columnName: 'Active',
    },
    cell: ({ row }) => {
      const value: boolean = row.getValue('active');
      return <BooleanCell value={value} trueText={'user-active'} falseText={'user-not-active'} />;
    },
  },
];
