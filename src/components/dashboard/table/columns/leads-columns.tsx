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
      return <div className="-ml-3 w-1/2 text-right">{roundedValue} %</div>;
    },
  },
  {
    accessorKey: 'enrollNumber',
    meta: {
      columnName: 'enrollNumber',
    },
    cell: ({ row }) => {
      const rawValue: string = row.getValue('enrollNumber');
      return <div className="ml-3 w-1/2 text-center">{rawValue}</div>;
    },
  },
  {
    accessorKey: 'createdAt',
    meta: {
      columnName: 'createdAt',
    },
    accessorFn: (row: any) => formatDate(row.createdAt),
  },
];
