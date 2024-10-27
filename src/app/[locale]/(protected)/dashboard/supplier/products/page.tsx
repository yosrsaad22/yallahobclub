import { DataTable } from '@/components/dashboard/table/data-table';
import Breadcrumb from '@/components/ui/breadcrumb';
import { ActionResponse } from '@/types';
import { IconBoxSeam } from '@tabler/icons-react';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import { SupplierProductColumns } from '@/components/dashboard/table/columns/products-columns';
import { bulkDeleteProducts, deleteProduct, getProductsBySupplier } from '@/actions/products';
import { currentUser } from '@/lib/auth';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return {
    title: 'Ecomness - ' + t('pages.products'),
    description: t('metadata.description'),
    keywords: ['Dropshipping Tunisie', 'Formation Dropshipping', 'Platforme Dropshipping', 'E-commerce'],
  };
}

export default async function Products() {
  const t = await getTranslations('dashboard');
  const breadcrumbItems = [{ title: t('pages.products'), link: '/dashboard/admin/products' }];

  const user = await currentUser();
  const userId = user?.id ?? '';
  const res: ActionResponse = await getProductsBySupplier(userId);
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
    <div className="w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-6">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center space-x-2 text-3xl font-bold">
          <IconBoxSeam className="h-7 w-7" />
          <h2 className="tracking-tight">{t('pages.products')}</h2>
        </div>
        <DataTable
          tag="products"
          translationPrefix="product"
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
          columns={SupplierProductColumns}
          data={productsData}
        />
      </div>
    </div>
  );
}
