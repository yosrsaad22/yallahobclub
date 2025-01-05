'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MEDIA_HOSTNAME, orderStatuses } from '@/lib/constants';
import { IconUser } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { Order, SubOrder, User } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const StatusCell = ({ status }: { status: string }) => {
  const tStatuses = useTranslations('dashboard.order-statuses');
  const statusObj =
    orderStatuses.find((s) => s.UpdateCode === status) ?? orderStatuses.find((s) => s.UpdateCode === 'EC03');

  if (!statusObj) return null;
  return (
    <div className={`mr-3 inline-flex w-fit rounded-full px-3 py-1 ${statusObj.Color} whitespace-nowrap`}>
      <p className="mx-auto">{tStatuses(statusObj.UpdateCode)}</p>
    </div>
  );
};

const UserCell = ({ user }: { user: User }) => {
  return (
    <div className="flex flex-row items-center gap-x-2">
      <Avatar className="h-8 w-8">
        <AvatarImage className="object-cover" src={`${MEDIA_HOSTNAME}${user.image}`} alt={user.fullName[0] ?? ''} />
        <AvatarFallback>
          {' '}
          <IconUser className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex h-[2.5rem] max-w-[100px] items-center overflow-hidden">
        <p
          className="overflow-hidden text-ellipsis break-words"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
          {user.fullName}
        </p>
      </div>
    </div>
  );
};

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

export const SellerOrderColumns: ColumnDef<Order & { fullName: string; subOrders: SubOrder[]; statuses: string[] }>[] =
  [
    {
      accessorKey: 'createdAt',
      meta: {
        columnName: 'CreatedAt',
      },
      accessorFn: (row: any) => formatDate(row.createdAt),
    },
    {
      accessorKey: 'code',
      meta: {
        columnName: 'code',
      },
      cell: ({ row }) => {
        const code: string = row.getValue<string>('code');
        return <div className="w-full max-w-[180px] truncate">{code}</div>;
      },
    },
    {
      accessorKey: 'fullName',
      meta: {
        columnName: 'full-name',
      },
      cell: ({ row }) => {
        const fullname: string = row.getValue<string>('fullName');

        return <div className="w-full max-w-[180px] truncate">{fullname}</div>;
      },
    },
    {
      accessorKey: 'number',
      meta: {
        columnName: 'number',
      },
    },
    {
      accessorKey: 'state',
      meta: {
        columnName: 'state',
      },
    },
    {
      accessorKey: 'subOrders',
      enableSorting: true,
      meta: {
        columnName: 'subOrders',
      },
      accessorFn: (row: any) =>
        Array.isArray(row.subOrders)
          ? row.subOrders.map((subOrder: SubOrder) => subOrder.deliveryId + subOrder.code).join(', ')
          : '',
      cell: ({ row }) => {
        const subOrders = row.original.subOrders.map((subOrder: SubOrder) =>
          subOrder.deliveryId ? subOrder.code : 'N/A',
        );
        return (
          <div className="flex flex-col flex-wrap gap-x-2">
            {subOrders.map((subOrder: string, index: number) => (
              <div key={index} className="flex flex-row gap-x-1">
                <p>{subOrder}</p>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'statuses',
      enableSorting: true,
      meta: {
        columnName: 'statuses',
      },
      cell: ({ row }) => {
        const statuses = row.original.statuses;
        return (
          <div className="-ml-8 flex flex-col items-center justify-center gap-2">
            {statuses.map((status, index) => (
              <StatusCell key={index} status={status} />
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'total',
      enableSorting: true,
      meta: {
        columnName: 'total',
      },
      cell: ({ row }) => {
        const total = row.getValue<string>('total');
        return <div>{total} TND</div>;
      },
    },
  ];

export const SupplierOrderColumns: ColumnDef<
  Order & { fullName: string; subOrders: SubOrder[]; statuses: string[] }
>[] = [
  {
    accessorKey: 'createdAt',
    meta: {
      columnName: 'CreatedAt',
    },
    accessorFn: (row: any) => formatDate(row.createdAt),
  },
  {
    accessorKey: 'code',
    meta: {
      columnName: 'code',
    },
    cell: ({ row }) => {
      const code: string = row.getValue<string>('code');
      return <div className="w-full max-w-[180px] truncate">{code}</div>;
    },
  },
  {
    accessorKey: 'fullName',
    meta: {
      columnName: 'full-name',
    },
    cell: ({ row }) => {
      const fullname: string = row.getValue<string>('fullName');

      return <div className="w-full max-w-[180px] truncate">{fullname}</div>;
    },
  },
  {
    accessorKey: 'number',
    meta: {
      columnName: 'number',
    },
  },
  {
    accessorKey: 'state',
    meta: {
      columnName: 'state',
    },
  },

  {
    accessorKey: 'subOrders',
    enableSorting: true,
    meta: {
      columnName: 'subOrders',
    },
    accessorFn: (row: any) =>
      Array.isArray(row.subOrders)
        ? row.subOrders.map((subOrder: SubOrder) => subOrder.deliveryId + subOrder.code).join(', ')
        : '',
    cell: ({ row }) => {
      const subOrders = row.original.subOrders.map((subOrder: SubOrder) =>
        subOrder.deliveryId ? subOrder.code : 'N/A',
      );
      return (
        <div className="flex flex-col flex-wrap gap-x-2">
          {subOrders.map((subOrder: string, index: number) => (
            <div key={index} className="flex flex-row gap-x-1">
              <p>{subOrder}</p>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'statuses',
    enableSorting: true,
    meta: {
      columnName: 'statuses',
    },
    cell: ({ row }) => {
      const statuses = row.original.statuses;
      return (
        <div className="-ml-8 flex flex-col items-center justify-center gap-2">
          {statuses.map((status, index) => (
            <StatusCell key={index} status={status} />
          ))}
        </div>
      );
    },
  },
];

export const AdminOrderColumns: ColumnDef<
  Order & { subOrders: SubOrder[]; statuses: string[]; seller: User; suppliers: string[]; fullName: string }
>[] = [
  {
    accessorKey: 'createdAt',
    meta: {
      columnName: 'CreatedAt',
    },
    accessorFn: (row: any) => formatDate(row.createdAt),
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
      columnName: 'full-name',
    },
    cell: ({ row }) => {
      const fullname: string = row.getValue<string>('fullName');

      return <div className="w-full truncate">{fullname}</div>;
    },
  },
  {
    accessorKey: 'number',
    meta: {
      columnName: 'number',
    },
  },
  {
    accessorKey: 'seller',
    enableSorting: true,
    meta: {
      columnName: 'seller',
    },
    accessorFn: (row) => row.seller.fullName + ' ' + row.seller.email + ' ' + row.seller.number + ' ' + row.seller.code,
    filterFn: (row, columnId, filterValue) => {
      const seller = row.original.seller; // Access the seller object directly from row.original
      const filterValues = Array.isArray(filterValue) ? filterValue : [filterValue];
      return seller && filterValues.includes(seller.id); // Check if seller.id matches any value in filterValues
    },
    cell: ({ row }) => {
      const seller: User = row.original.seller;

      return (
        <div className="">
          <UserCell user={seller} />
        </div>
      );
    },
  },
  {
    accessorKey: 'subOrders',
    enableSorting: true,
    meta: {
      columnName: 'subOrders',
    },
    accessorFn: (row: any) =>
      Array.isArray(row.subOrders)
        ? row.subOrders.map((subOrder: SubOrder) => subOrder.deliveryId + subOrder.code).join(', ')
        : '',
    cell: ({ row }) => {
      const subOrders = row.original.subOrders.map((subOrder: SubOrder) =>
        subOrder.deliveryId ? subOrder.code : 'N/A',
      );
      return (
        <div className="flex flex-col flex-wrap gap-x-2">
          {subOrders.map((subOrder: string, index: number) => (
            <div key={index} className="flex flex-row gap-x-1">
              <p>{subOrder}</p>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'statuses',
    enableSorting: true,
    meta: {
      columnName: 'statuses',
    },
    filterFn: (row, columnId, filterValue) => {
      const statuses = row.getValue(columnId) as string[];
      const filterValues = Array.isArray(filterValue) ? filterValue : [filterValue];
      return filterValues.some((value) => statuses.includes(value));
    },
    cell: ({ row }) => {
      const statuses = row.original.statuses;
      return (
        <div className="-ml-8 flex flex-col items-center justify-center gap-2">
          {statuses.map((status, index) => (
            <StatusCell key={index} status={status} />
          ))}
        </div>
      );
    },
  },
  {
    id: 'suppliers', // Unique identifier for the column
    accessorFn: (row) => row.suppliers, // Provide the suppliers field for filtering
    filterFn: (row, columnId, filterValue) => {
      const suppliers = row.getValue(columnId) as string[];
      const filterValues = Array.isArray(filterValue) ? filterValue : [filterValue];
      return filterValues.some((value) => suppliers.includes(value));
    },
    enableHiding: true, // Prevent hiding the column through visibility toggles
    enableSorting: false, // Disable sorting since it's for filtering only
    cell: undefined, // Prevent rendering a cell
  },
];
