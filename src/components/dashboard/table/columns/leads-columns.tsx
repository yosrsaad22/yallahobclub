'use client';
import { ColumnDef, RowData } from '@tanstack/react-table';
import { DataTableLead } from '@/types';
import { formatDate } from '@/lib/utils';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    columnName: string;
  }
}

export const LeadColumns: ColumnDef<DataTableLead>[] = [
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
    accessorKey: 'videoProgress',
    meta: {
      columnName: 'videoProgress',
    },
    cell: ({ row }) => {
      const rawValue = row.getValue('videoProgress');
      const value = typeof rawValue === 'number' ? rawValue : parseFloat(String(rawValue)) || 0;
      const roundedValue = value.toFixed(2);
      return <div>{roundedValue} %</div>;
    },
  },
  {
    accessorKey: 'enrollNumber',
    meta: {
      columnName: 'enrollNumber',
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
];
