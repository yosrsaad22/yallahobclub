import { DataTable } from '@/components/dashboard/table/data-table';
import Breadcrumb from '@/components/ui/breadcrumb';
import { ActionResponse } from '@/types';
import { IconBoxSeam } from '@tabler/icons-react';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import { AdminProductColumns } from '@/components/dashboard/table/columns/products-columns';
import { bulkDeleteProducts, deleteProduct, getProducts } from '@/actions/products';

export default async function Products() {
  const t = await getTranslations('dashboard');
  const breadcrumbItems = [{ title: t('pages.products'), link: '/dashboard/admin/products' }];
  const res: ActionResponse = await getProducts();
  const productsData: any[] = res.error ? [] : res.data;

  const handleDelete = async (id: string) => {
    'use server';
    const res = await deleteProduct(id);
    return res;
  };

  const handleBulkDelete = async (ids: string[]) => {
    'use server';
    const res = await bulkDeleteProducts(ids);
    return res;
  };

  return (
    <div className="h-full w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center space-x-2 text-3xl font-bold">
          <IconBoxSeam className="h-7 w-7" stroke={2.9} />
          <h2 className="tracking-tight">{t('pages.products')}</h2>
        </div>
        <DataTable
          tag="products"
          translationPrefix="product"
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
          columns={AdminProductColumns}
          data={productsData}
        />
      </div>
    </div>
  );
}
