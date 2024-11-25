'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MEDIA_HOSTNAME, orderStatuses } from '@/lib/constants';
import { IconUser } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { Order, OrderProduct, Pickup, Product, SubOrder, User } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { formatDate } from '@/lib/utils';

const StatusCell = ({ status }: { status: string }) => {
  const tStatuses = useTranslations('dashboard.order-statuses');
  const statusObj =
    orderStatuses.find((s) => s.UpdateCode === status) ?? orderStatuses.find((s) => s.UpdateCode === 'EC03');

  if (!statusObj) return null;
  <div className={`mr-3 inline-flex w-auto rounded-full px-3 py-1 ${statusObj.Color}`}>
    {tStatuses(statusObj.UpdateCode)}
  </div>;
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

export const SupplierPickupColumns: ColumnDef<
  Pickup & {
    ordersCount: number;
    subOrders: SubOrder & { order: Order; products: OrderProduct & { product: Product } }[];
  }
>[] = [
  {
    accessorKey: 'createdAt',
    meta: {
      columnName: 'CreatedAt',
    },
    cell: ({ row }) => {
      const date = formatDate(row.getValue('createdAt'));

      return <div className="flex w-full">{date}</div>;
    },
  },
  {
    accessorKey: 'pickupDate',
    meta: {
      columnName: 'pickupDate',
    },
    cell: ({ row }) => {
      const date = formatDate(row.getValue('pickupDate'));
      return <div className="flex w-full">{date}</div>;
    },
  },
  {
    accessorKey: 'code',
    meta: {
      columnName: 'code',
    },
    cell: ({ row }) => {
      const code: string = row.getValue('code');
      return <div className="w-full">{code}</div>;
    },
  },
  {
    accessorKey: 'ordersCount',
    meta: {
      columnName: 'ordersCount',
    },
    cell: ({ row }) => {
      return <div className="flex w-full">{row.getValue('ordersCount')}</div>;
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
      const subOrders = row.original.subOrders.map((subOrder: any) => subOrder.code);
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
];

export const AdminPickupColumns: ColumnDef<
  Pickup & {
    ordersCount: number;
    supplier: User;
    subOrders: SubOrder &
      { order: Order & { seller: User }; products: OrderProduct & { product: Product & { supplier: User } } }[];
  }
>[] = [
  {
    accessorKey: 'createdAt',
    meta: {
      columnName: 'CreatedAt',
    },
    accessorFn: (row: any) => formatDate(row.createdAt),
  },
  {
    accessorKey: 'pickupDate',
    meta: {
      columnName: 'pickupDate',
    },
    accessorFn: (row: any) => formatDate(row.pickupDate),
  },
  {
    accessorKey: 'code',
    meta: {
      columnName: 'code',
    },
    cell: ({ row }) => {
      const code: string = row.getValue('code');
      return <div className="w-full">{code}</div>;
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
      const subOrderCodes = row.original.subOrders.map((subOrder: any) => subOrder.code).join(', ');
      return <div className="flex max-w-[200px] flex-row flex-wrap gap-x-2">{subOrderCodes}</div>;
    },
  },
  {
    accessorKey: 'supplier',
    enableSorting: false,
    meta: {
      columnName: 'Supplier',
    },
    accessorFn: (row) =>
      row.supplier.fullName + ' ' + row.supplier.email + ' ' + row.supplier.number + ' ' + row.supplier.code,
    cell: ({ row }) => {
      const supplier = row.original.supplier;
      return <UserCell key={supplier.id} user={supplier} />;
    },
  },
];
