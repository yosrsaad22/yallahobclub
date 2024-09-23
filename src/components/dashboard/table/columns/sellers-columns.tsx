'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MEDIA_HOSTNAME } from '@/lib/constants';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import { ColumnDef, RowData } from '@tanstack/react-table';
import { DataTableUser } from '@/types';
import { formatDate } from '@/lib/utils';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    columnName: string;
  }
}

export const SellerColumns: ColumnDef<DataTableUser>[] = [
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
          <Avatar className="h-10 w-10">
            <AvatarImage className="object-cover" src={`${MEDIA_HOSTNAME}${image}` ?? ''} alt={fullName[0] ?? ''} />
            <AvatarFallback>{fullName[0]}</AvatarFallback>
          </Avatar>
        </div>
      );
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
    accessorKey: 'createdAt',
    meta: {
      columnName: 'createdAt',
    },
    cell: ({ row }) => {
      return <div className="flex ">{formatDate(row.getValue('createdAt'))}</div>;
    },
  },
  {
    accessorKey: 'active',
    meta: {
      columnName: 'Active',
    },
    cell: ({ row }) => {
      if (!row.getValue('active')) {
        return (
          <div className="w-1/2">
            <IconCircleX className="text-destructive" />
          </div>
        );
      }
      return (
        <div className="w-1/2">
          <IconCircleCheck className="text-success" />
        </div>
      );
    },
  },
  {
    accessorKey: 'paid',
    meta: {
      columnName: 'Paid',
    },
    cell: ({ row }) => {
      if (!row.getValue('paid')) {
        return (
          <div className="w-1/2">
            <IconCircleX className="text-destructive" />
          </div>
        );
      }
      return (
        <div className="w-1/2">
          <IconCircleCheck className="text-success" />
        </div>
      );
    },
  },
];
