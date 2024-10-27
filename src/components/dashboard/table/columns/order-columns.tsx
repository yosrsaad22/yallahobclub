'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MEDIA_HOSTNAME, orderStatuses } from '@/lib/constants';
import { IconUser } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { Order, User } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { formatDate } from '@/lib/utils';

const StatusCell = ({ status }: { status: string }) => {
  const tStatuses = useTranslations('dashboard.order-statuses');
  const statusObj = orderStatuses.find((s) => s.Key === status) ?? orderStatuses.find((s) => s.Key === 'n-a');

  if (!statusObj) return null;
  return <div className={`mr-3 inline-flex rounded-full px-3 py-1 ${statusObj.Color}`}>{tStatuses(statusObj.Key)}</div>;
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

export const SellerOrderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: 'createdAt',
    meta: {
      columnName: 'CreatedAt',
    },
    cell: ({ row }) => {
      return <div className="flex w-full ">{formatDate(row.getValue('createdAt'))}</div>;
    },
  },
  {
    accessorKey: 'deliveryId',
    meta: {
      columnName: 'deliveryId',
    },
    cell: ({ row }) => {
      const id: string = row.getValue<string>('deliveryId');
      return <div className="w-full max-w-[180px] truncate">{id}</div>;
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
    accessorKey: 'status',
    enableSorting: true,
    meta: {
      columnName: 'status',
    },
    cell: ({ row }) => {
      const status = row.getValue<string>('status');
      return <StatusCell status={status} />;
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

export const SupplierOrderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: 'createdAt',
    meta: {
      columnName: 'CreatedAt',
    },
    cell: ({ row }) => {
      return <div className="flex w-full ">{formatDate(row.getValue('createdAt'))}</div>;
    },
  },
  {
    accessorKey: 'deliveryId',
    meta: {
      columnName: 'deliveryId',
    },
    cell: ({ row }) => {
      const id: string = row.getValue<string>('deliveryId');
      return <div className="w-full max-w-[180px] truncate">{id}</div>;
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
    accessorKey: 'status',
    enableSorting: true,
    meta: {
      columnName: 'status',
    },
    cell: ({ row }) => {
      const status = row.getValue<string>('status');
      return <StatusCell status={status} />;
    },
  },
];

export const AdminOrderColumns: ColumnDef<Order & { seller: User; fullName: string }>[] = [
  {
    accessorKey: 'createdAt',
    meta: {
      columnName: 'CreatedAt',
    },
    cell: ({ row }) => {
      return <div className="flex w-full ">{formatDate(row.getValue('createdAt'))}</div>;
    },
  },
  {
    accessorKey: 'deliveryId',
    meta: {
      columnName: 'deliveryId',
    },
    cell: ({ row }) => {
      const id: string = row.getValue<string>('deliveryId');
      return <div className="w-full max-w-[180px] truncate">{id}</div>;
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
    accessorKey: 'city',
    meta: {
      columnName: 'city',
    },
  },

  {
    accessorKey: 'status',
    enableSorting: true,
    meta: {
      columnName: 'status',
    },
    cell: ({ row }) => {
      const status = row.getValue<string>('status');
      return <StatusCell status={status} />;
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
    accessorKey: 'seller',
    enableSorting: true,
    meta: {
      columnName: 'seller',
    },
    cell: ({ row }) => {
      const seller: User = row.getValue('seller');
      return (
        <div className="">
          <UserCell user={seller} />
        </div>
      );
    },
  },
];
