'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MEDIA_HOSTNAME } from '@/lib/constants';
import { IconCircleCheck, IconCircleX, IconUser } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { Product, User } from '@prisma/client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { MediaType } from '@/types';
import { formatDate } from '@/lib/utils';

const CategoryCell = ({ category }: { category: string }) => {
  const tFields = useTranslations('fields');
  return <p>{tFields(`category-${category.toLowerCase()}`)}</p>;
};

const SupplierCell = ({ user }: { user: User }) => {
  return (
    <div className="flex flex-row items-center gap-x-3">
      <Avatar className="h-9 w-9">
        <AvatarImage className="object-cover" src={`${MEDIA_HOSTNAME}${user.image}`} alt={user.fullName[0] ?? ''} />
        <AvatarFallback>
          {' '}
          <IconUser className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      <p>{user.fullName}</p>
    </div>
  );
};

const ImageCell = ({ image }: { image: string }) => {
  return (
    <div className="flex  h-[70px] w-[70px] items-center justify-center object-cover  p-2">
      <Image
        className="aspect-square rounded-sm object-cover"
        src={`${MEDIA_HOSTNAME}${image}`}
        width={70}
        height={70}
        alt={'image'}
      />
    </div>
  );
};

const BooleanCell = ({ value, trueText, falseText }: { value: boolean; trueText: string; falseText: string }) => {
  const tFields = useTranslations('fields');
  if (!value) {
    return (
      <div className="flex w-[120px] items-center justify-center">
        <Badge className="text-md px-3 py-1 font-normal" variant={'destructive'}>
          {tFields(falseText)}
        </Badge>
      </div>
    );
  }
  return (
    <div className="flex w-[120px] items-center justify-center">
      <Badge className="text-md px-3 py-1 font-normal" variant={'success'}>
        {tFields(trueText)}
      </Badge>
    </div>
  );
};

export const AdminProductColumns: ColumnDef<Product & { media: MediaType[]; supplier: User }>[] = [
  {
    accessorKey: 'createdAt',
    meta: {
      columnName: 'CreatedAt',
    },
    accessorFn: (row: any) => row.createdAt,
    enableHiding: true,
    enableSorting: false,
    cell: undefined,
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
    accessorKey: 'media',
    meta: {
      columnName: 'media',
    },
    enableSorting: false,
    cell: ({ row }) => {
      const image = row.getValue<MediaType[]>('media')[0].key;
      return <ImageCell image={image} />;
    },
  },
  {
    accessorKey: 'name',
    meta: {
      columnName: 'Name',
    },
    cell: ({ row }) => {
      const name: string = row.getValue<string>('name');
      return <div className="mr-3 w-full max-w-[180px] truncate">{name}</div>;
    },
  },
  {
    accessorKey: 'category',
    meta: {
      columnName: 'Category',
    },
    cell: ({ row }) => {
      const category = row.getValue<string>('category');
      return <CategoryCell category={category} />;
    },
  },
  {
    accessorKey: 'wholesalePrice',
    enableSorting: true,
    meta: {
      columnName: 'Price',
    },
    cell: ({ row }) => {
      const price = row.getValue<number>('wholesalePrice');
      return <div className="w-1/2 text-right">{price} DT</div>;
    },
  },
  {
    accessorKey: 'stock',
    enableSorting: true,
    meta: {
      columnName: 'Stock',
    },
    cell: ({ row }) => {
      const stock = row.getValue<number>('stock');
      return <div className="">{stock}</div>;
    },
  },
  {
    accessorKey: 'admin',
    meta: {
      columnName: 'admin',
    },
    cell: ({ row }) => {
      const admin: string | null = row.original.admin;

      return <div className="">{admin ? admin : 'N/A'}</div>;
    },
  },
  {
    accessorKey: 'supplier',
    enableSorting: false,
    meta: {
      columnName: 'Supplier',
    },
    filterFn: (row, columnId, filterValue) => {
      const supplier = row.original.supplier; // Ensure `supplier` is accessible from `row.original`
      const filterValues = Array.isArray(filterValue) ? filterValue : [filterValue];

      // Return true if the supplier ID matches any of the selected filter values
      return supplier && filterValues.includes(supplier.id);
    },

    cell: ({ row }) => {
      const user: User = row.getValue('supplier');
      return user ? <SupplierCell user={user} /> : null;
    },
  },
  {
    accessorKey: 'published',
    meta: {
      columnName: 'Published',
    },
    cell: ({ row }) => {
      const published = row.getValue<boolean>('published');
      return <BooleanCell value={published} trueText="product-approved" falseText="product-not-approved" />;
    },
  },
];

export const SupplierProductColumns: ColumnDef<Product & { media: MediaType[]; supplier: User }>[] = [
  {
    accessorKey: 'media',
    meta: {
      columnName: 'media',
    },
    enableSorting: false,
    cell: ({ row }) => {
      const image = row.getValue<MediaType[]>('media')[0].key;
      return <ImageCell image={image} />;
    },
  },
  {
    accessorKey: 'name',
    meta: {
      columnName: 'Name',
    },
    cell: ({ row }) => {
      const name: string = row.getValue<string>('name');
      return <div className="w-full max-w-[180px] truncate">{name}</div>;
    },
  },
  {
    accessorKey: 'category',
    meta: {
      columnName: 'Category',
    },
    cell: ({ row }) => {
      const category = row.getValue<string>('category');
      return <CategoryCell category={category} />;
    },
  },

  {
    accessorKey: 'wholesalePrice',
    enableSorting: true,
    meta: {
      columnName: 'Price',
    },
    cell: ({ row }) => {
      const price = row.getValue<number>('wholesalePrice');
      return <div className="w-1/2 text-center">{price} DT</div>;
    },
  },
  {
    accessorKey: 'stock',
    enableSorting: true,
    meta: {
      columnName: 'Stock',
    },
    cell: ({ row }) => {
      const stock = row.getValue<number>('stock');
      return <div className="w-1/2 text-center">{stock}</div>;
    },
  },
  {
    accessorKey: 'published',
    meta: {
      columnName: 'Published',
    },
    cell: ({ row }) => {
      const published = row.getValue<boolean>('published');
      return <BooleanCell value={published} trueText="product-approved" falseText="product-pending" />;
    },
  },
];
