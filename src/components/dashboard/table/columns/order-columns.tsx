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
  const statusObj = orderStatuses.find((s) => s.Key === status) ?? orderStatuses.find((s) => s.Key === 'n-a-SH017');

  if (!statusObj) return null;
  return (
    <div className={`mr-3 inline-flex w-auto  rounded-full px-3 py-1 ${statusObj.Color}`}>
      <p className="mx-auto">{tStatuses(statusObj.Key)}</p>
    </div>
  );
};

const UserCell = ({ user }: { user: User }) => {
  return (
    <div className="flex flex-row items-center gap-x-3">
      <Avatar className="h-9 w-9">
        <AvatarImage className="object-cover" src={`${MEDIA_HOSTNAME}${user.image}`} alt={user.fullName[0] ?? ''} />
        <AvatarFallback>
          {' '}
          <IconUser className="h-5 w-5" />
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

export const SellerOrderColumns: ColumnDef<Order & { subOrders: SubOrder[]; statuses: string[] }>[] = [
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
    accessorKey: 'firstName',
    meta: {
      columnName: 'first-name',
    },
    cell: ({ row }) => {
      const firstname: string = row.getValue<string>('firstName');

      return <div className="w-full max-w-[180px] truncate">{firstname}</div>;
    },
  },
  {
    accessorKey: 'lastName',
    meta: {
      columnName: 'last-name',
    },
    cell: ({ row }) => {
      const lastname: string = row.getValue<string>('lastName');

      return <div className="w-full max-w-[180px] truncate">{lastname}</div>;
    },
  },
  {
    accessorKey: 'number',
    meta: {
      columnName: 'number',
    },
  },
  {
    accessorKey: 'city',
    meta: {
      columnName: 'city',
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
        <div className="flex w-fit flex-col gap-2">
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
  {
    accessorKey: 'paid',
    meta: {
      columnName: 'Paid',
    },
    cell: ({ row }) => {
      const value: boolean = row.getValue('paid');
      return <BooleanCell value={value} trueText={'user-paid'} falseText={'user-not-paid'} />;
    },
  },
];

export const SupplierOrderColumns: ColumnDef<Order & { subOrders: SubOrder[]; statuses: string[] }>[] = [
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
    accessorKey: 'firstName',
    meta: {
      columnName: 'first-name',
    },
    cell: ({ row }) => {
      const firstname: string = row.getValue<string>('firstName');

      return <div className="w-full max-w-[180px] truncate">{firstname}</div>;
    },
  },
  {
    accessorKey: 'lastName',
    meta: {
      columnName: 'last-name',
    },
    cell: ({ row }) => {
      const lastname: string = row.getValue<string>('lastName');

      return <div className="w-full max-w-[180px] truncate">{lastname}</div>;
    },
  },
  {
    accessorKey: 'number',
    meta: {
      columnName: 'number',
    },
  },
  {
    accessorKey: 'city',
    meta: {
      columnName: 'city',
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
        <div className="flex w-fit flex-col gap-2">
          {statuses.map((status, index) => (
            <StatusCell key={index} status={status} />
          ))}
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
      const value: boolean = row.getValue('paid');
      return <BooleanCell value={value} trueText={'user-paid'} falseText={'user-not-paid'} />;
    },
  },
];

export const AdminOrderColumns: ColumnDef<
  Order & { subOrders: SubOrder[]; statuses: string[]; seller: User; fullName: string }
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
    accessorKey: 'seller',
    enableSorting: true,
    meta: {
      columnName: 'seller',
    },
    accessorFn: (row) => row.seller.fullName + ' ' + row.seller.email + ' ' + row.seller.number + ' ' + row.seller.code,
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
    cell: ({ row }) => {
      const statuses = row.original.statuses;
      return (
        <div className="flex w-fit flex-col gap-2">
          {statuses.map((status, index) => (
            <StatusCell key={index} status={status} />
          ))}
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
      const value: boolean = row.getValue('paid');
      return <BooleanCell value={value} trueText={'user-paid'} falseText={'user-not-paid'} />;
    },
  },
];
