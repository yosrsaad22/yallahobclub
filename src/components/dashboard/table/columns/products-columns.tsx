'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MEDIA_HOSTNAME } from '@/lib/constants';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import { ColumnDef, RowData } from '@tanstack/react-table';
import { Product, User } from '@prisma/client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const CategoryCell = ({ category }: { category: string }) => {
  const tFields = useTranslations('fields');
  return <p>{tFields(`category-${category.toLowerCase()}`)}</p>;
};

const SupplierCell = ({ user }: { user: User }) => {
  return (
    <div className="flex flex-row items-center gap-x-4">
      <Avatar className="h-8 w-8">
        <AvatarImage
          className="object-cover"
          src={`${MEDIA_HOSTNAME}${user.image}` ?? ''}
          alt={user.fullName[0] ?? ''}
        />
        <AvatarFallback>{user.fullName[0]}</AvatarFallback>
      </Avatar>
      <p>{user.fullName}</p>
    </div>
  );
};

const ImageCell = ({ image }: { image: string }) => {
  return (
    <div className="flex h-[80px] w-[80px] items-center justify-center p-2">
      <Image src={`${MEDIA_HOSTNAME}${image}` ?? ''} width={80} height={80} alt={'image'} />
    </div>
  );
};

const FeaturedCell = ({ featured }: { featured: boolean }) => {
  if (!featured) {
    return (
      <div className="flex w-1/2 items-center justify-center">
        <IconCircleX className="text-destructive" />
      </div>
    );
  }
  return (
    <div className="flex w-1/2 items-center justify-center">
      <IconCircleCheck className="text-success" />
    </div>
  );
};

export const AdminProductColumns: ColumnDef<Product & { supplier: User }>[] = [
  {
    accessorKey: 'images',
    meta: {
      columnName: 'Images',
    },
    enableSorting: false,
    cell: ({ row }) => {
      const image = row.getValue<string[]>('images')[0];
      return <ImageCell image={image} />;
    },
  },
  {
    accessorKey: 'name',
    meta: {
      columnName: 'Name',
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
    accessorKey: 'featured',
    meta: {
      columnName: 'Featured',
    },
    cell: ({ row }) => {
      const featured = row.getValue<boolean>('featured');
      return <FeaturedCell featured={featured} />;
    },
  },
  {
    accessorKey: 'supplier',
    enableSorting: false,
    meta: {
      columnName: 'Supplier',
    },
    cell: ({ row }) => {
      const user: User = row.getValue('supplier');
      return user ? <SupplierCell user={user} /> : null;
    },
  },
];

// Supplier Product Columns
export const SupplierProductColumns: ColumnDef<Product & { supplier: User }>[] = [
  {
    accessorKey: 'images',
    meta: {
      columnName: 'Images',
    },
    enableSorting: false,
    cell: ({ row }) => {
      const image = row.getValue<string[]>('images')[0];
      return <ImageCell image={image} />;
    },
  },
  {
    accessorKey: 'name',
    meta: {
      columnName: 'Name',
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
    accessorKey: 'featured',
    meta: {
      columnName: 'Featured',
    },
    cell: ({ row }) => {
      const featured = row.getValue<boolean>('featured');
      return <FeaturedCell featured={featured} />;
    },
  },
];
