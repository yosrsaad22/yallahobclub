'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MEDIA_HOSTNAME, orderStatuses } from '@/lib/constants';
import { IconUser } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { Media, Order, Product, SubOrder, User } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const StatusCell = ({ status }: { status: string }) => {
  const tStatuses = useTranslations('dashboard.order-statuses');
  const statusObj =
    orderStatuses.find((s) => s.UpdateCode === status) ?? orderStatuses.find((s) => s.UpdateCode === 'EC04');

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

export const SellerOrderColumns: ColumnDef<
  Order & {
    fullName: string;
    subOrders: SubOrder[];
    statuses: string[];
    products: Product[];
    displayProducts: (Product & { media: Media[] })[];
  }
>[] = [
  {
    accessorKey: 'createdAt',
    meta: {
      columnName: 'CreatedAt',
    },
    accessorFn: (row: any) => row.createdAt,
    cell: ({ getValue }) => formatDate(new Date(getValue() as string | number | Date)),
    filterFn: (row, columnId, filterValue) => {
      const rawDateValue = row.getValue(columnId);
      const dateValue = new Date(rawDateValue as string | number | Date);
      const filterDate = new Date(filterValue);
      return (
        dateValue.getFullYear() === filterDate.getFullYear() &&
        dateValue.getMonth() === filterDate.getMonth() &&
        dateValue.getDate() === filterDate.getDate()
      );
    },
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

      return <div className="max-w-28 truncate">{fullname}</div>;
    },
  },
  {
    accessorKey: 'number',
    meta: {
      columnName: 'number',
    },
  },
  {
    id: 'displayProducts',
    accessorFn: (row) => row.displayProducts || [],
    enableSorting: false,
    cell: ({ row }) => {
      const products = row.original.displayProducts;
      return (
        <div className="mr-3 flex flex-col gap-y-2 md:mr-0">
          {products.map((product, index) => (
            <div key={index} className="flex flex-row items-center gap-x-3">
              <Image
                height={50}
                width={50}
                className="h-8 w-8 object-cover"
                src={`${MEDIA_HOSTNAME}${product.media[0]?.key}`}
                alt={product.name[0] ?? ''}
              />
              <p className=" max-w-36 truncate">{product.name}</p>
            </div>
          ))}
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
        <div className=" flex flex-col items-center justify-center gap-2">
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
    id: 'products',
    accessorFn: (row) => row.products || [],
    filterFn: (row, columnId, filterValue) => {
      const filterValues = Array.isArray(filterValue) ? filterValue : [filterValue];
      const products = row.getValue(columnId) as string[];

      if (!products || products.length === 0 || filterValues.length === 0) {
        return false;
      }
      return filterValues.some((value) => products.includes(value));
    },
    enableHiding: true,
    enableSorting: false,
    cell: undefined,
  },
];

export const SupplierOrderColumns: ColumnDef<
  Order & {
    fullName: string;
    subOrders: SubOrder[];
    statuses: string[];
    products: (Product & { media: Media[] })[];
    displayProducts: (Product & { media: Media[] })[];
  }
>[] = [
  {
    accessorKey: 'createdAt',
    meta: {
      columnName: 'CreatedAt',
    },
    accessorFn: (row: any) => row.createdAt,
    cell: ({ getValue }) => formatDate(new Date(getValue() as string | number | Date)),
    filterFn: (row, columnId, filterValue) => {
      const rawDateValue = row.getValue(columnId);
      const dateValue = new Date(rawDateValue as string | number | Date);
      const filterDate = new Date(filterValue);
      return (
        dateValue.getFullYear() === filterDate.getFullYear() &&
        dateValue.getMonth() === filterDate.getMonth() &&
        dateValue.getDate() === filterDate.getDate()
      );
    },
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

      return <div className="max-w-28 truncate">{fullname}</div>;
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
    id: 'displayProducts',
    accessorFn: (row) => row.displayProducts || [],
    enableSorting: false,
    cell: ({ row }) => {
      const products = row.original.displayProducts;
      return (
        <div className="mr-3 flex flex-col gap-y-2 md:mr-0">
          {products.map((product, index) => (
            <div key={index} className="flex flex-row items-center gap-x-3">
              <Image
                height={50}
                width={50}
                className="h-8 w-8 object-cover"
                src={`${MEDIA_HOSTNAME}${product.media[0]?.key}`}
                alt={product.name[0] ?? ''}
              />
              <p className=" max-w-36 truncate">{product.name}</p>
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
        <div className=" flex flex-col items-center justify-center gap-2">
          {statuses.map((status, index) => (
            <StatusCell key={index} status={status} />
          ))}
        </div>
      );
    },
  },
  {
    id: 'products',
    accessorFn: (row) => row.products || [],
    filterFn: (row, columnId, filterValue) => {
      const filterValues = Array.isArray(filterValue) ? filterValue : [filterValue];
      const products = row.getValue(columnId) as string[];
      if (!products || products.length === 0 || filterValues.length === 0) {
        return false;
      }
      return filterValues.some((value) => products.includes(value));
    },
    enableHiding: true,
    enableSorting: false,
    cell: undefined,
  },
];

export const AdminOrderColumns: ColumnDef<
  Order & {
    subOrders: SubOrder[];
    statuses: string[];
    seller: User;
    suppliers: string[];
    fullName: string;
    products: Product[];
    displayProducts: (Product & { media: Media[] })[];
  }
>[] = [
  {
    accessorKey: 'createdAt',
    meta: {
      columnName: 'CreatedAt',
    },
    accessorFn: (row: any) => row.createdAt,
    cell: ({ getValue }) => formatDate(new Date(getValue() as string | number | Date)),
    filterFn: (row, columnId, filterValue) => {
      const rawDateValue = row.getValue(columnId);
      const dateValue = new Date(rawDateValue as string | number | Date);
      const filterDate = new Date(filterValue);
      return (
        dateValue.getFullYear() === filterDate.getFullYear() &&
        dateValue.getMonth() === filterDate.getMonth() &&
        dateValue.getDate() === filterDate.getDate()
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
      columnName: 'full-name',
    },
    cell: ({ row }) => {
      const fullname: string = row.getValue<string>('fullName');

      return <div className="max-w-28 truncate">{fullname}</div>;
    },
  },
  {
    accessorKey: 'number',
    meta: {
      columnName: 'number',
    },
  },
  {
    id: 'displayProducts',
    accessorFn: (row) => row.displayProducts || [],
    enableSorting: false,
    cell: ({ row }) => {
      const products = row.original.displayProducts;
      return (
        <div className="flex flex-col gap-y-2">
          {products.map((product, index) => (
            <div key={index} className="flex flex-row items-center gap-x-3">
              <Image
                height={50}
                width={50}
                className="h-8 w-8 object-cover"
                src={`${MEDIA_HOSTNAME}${product.media[0]?.key}`}
                alt={product.name[0] ?? ''}
              />
              <p className=" max-w-36 truncate">{product.name}</p>
            </div>
          ))}
        </div>
      );
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
      const seller = row.original.seller;
      const filterValues = Array.isArray(filterValue) ? filterValue : [filterValue];
      return seller && filterValues.includes(seller.id);
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
        <div className=" flex flex-col items-center justify-center gap-2">
          {statuses.map((status, index) => (
            <StatusCell key={index} status={status} />
          ))}
        </div>
      );
    },
  },
  {
    id: 'suppliers',
    accessorFn: (row) => row.suppliers,
    filterFn: (row, columnId, filterValue) => {
      const suppliers = row.getValue(columnId) as string[];
      const filterValues = Array.isArray(filterValue) ? filterValue : [filterValue];
      return filterValues.some((value) => suppliers.includes(value));
    },
    enableHiding: true,
    cell: undefined,
  },
  {
    id: 'products',
    accessorFn: (row) => row.products || [],
    filterFn: (row, columnId, filterValue) => {
      const filterValues = Array.isArray(filterValue) ? filterValue : [filterValue];
      const products = row.getValue(columnId) as string[];
      if (!products || products.length === 0 || filterValues.length === 0) {
        return false;
      }
      return filterValues.some((value) => products.includes(value));
    },
    enableHiding: true,
    enableSorting: false,
    cell: undefined,
  },
];
