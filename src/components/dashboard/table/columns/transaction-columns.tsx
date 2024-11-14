'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MEDIA_HOSTNAME, orderStatuses } from '@/lib/constants';
import { IconUser } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { Order, Transaction, User } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { formatDate } from '@/lib/utils';

const TypeCell = ({ type }: { type: string }) => {
  const tTransactionTypes = useTranslations('dashboard.transaction-types');
  return <div className={``}>{tTransactionTypes(type) ?? 'N/A'}</div>;
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

export const UserTransactionColumns: ColumnDef<Transaction & { order: Order }>[] = [
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
    accessorKey: 'type',
    meta: {
      columnName: 'type',
    },
    cell: ({ row }) => {
      const type: string = row.getValue('type');
      return <TypeCell type={type} />;
    },
  },
  {
    accessorKey: 'amount',
    meta: {
      columnName: 'amount',
    },
    cell: ({ row }) => {
      const amount: number = row.getValue('amount');
      return (
        <div className="">
          <p className={` font-bold ${amount >= 0 ? 'text-success' : 'text-destructive'}`}>
            {' '}
            {amount >= 0 ? '+' : ''}
            {amount} TND
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'order',
    meta: {
      columnName: 'order',
    },
    cell: ({ row }) => {
      const order: Order | null = row.getValue<Order | null>('order');

      return <div className="">{order ? order.code : 'N/A'}</div>;
    },
  },
];

export const AdminTransactionColumns: ColumnDef<Transaction & { user: User; order: Order }>[] = [
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
    accessorKey: 'user',
    meta: {
      columnName: 'user',
    },
    accessorFn: (row) => row.user.fullName + ' ' + row.user.email + ' ' + row.user.number + ' ' + row.user.code,
    cell: ({ row }) => {
      const user: User = row.original.user;

      return (
        <div className="">
          <UserCell user={user} />
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    meta: {
      columnName: 'type',
    },
    cell: ({ row }) => {
      const type: string = row.getValue('type');
      return <TypeCell type={type} />;
    },
  },
  {
    accessorKey: 'amount',
    meta: {
      columnName: 'amount',
    },
    cell: ({ row }) => {
      const amount: number = row.getValue('amount');
      return (
        <div className="">
          <p className={` font-bold ${amount >= 0 ? 'text-success' : 'text-destructive'}`}>
            {' '}
            {amount >= 0 ? '+' : ''}
            {amount} TND
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'order',
    meta: {
      columnName: 'order',
    },
    cell: ({ row }) => {
      const order: Order | null = row.getValue<Order | null>('order');

      return <div className="">{order ? order.code : 'N/A'}</div>;
    },
  },
];
