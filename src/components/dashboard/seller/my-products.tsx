'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/navigation';
import { Product } from '@prisma/client';
import { getProductsBySeller, removeFromMyProducts } from '@/actions/products';
import { useQuery } from '@tanstack/react-query';
import { MediaType } from '@/types';
import { IconInfoCircleFilled, IconLoader2, IconShoppingCart } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { IconChevronLeft, IconChevronRight, IconSearch } from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductCard } from '../cards/product-card';
import { productCategoryOptions } from '@/lib/constants';
import { toast } from '@/components/ui/use-toast';
import { DeleteDialog } from '../dialogs/delete-dialog';

interface MyProductsFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MyProducts({ className }: MyProductsFormProps) {
  const t = useTranslations('dashboard.text');
  const tValidation = useTranslations('validation');
  const tMarketplace = useTranslations('dashboard.marketplace');
  const [isDialogLoading, startTransition] = React.useTransition();

  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(null);
  const itemsPerPage = 16;
  const params = useSearchParams();
  const search = params.get('search') ?? '';
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['my-products'],
    queryFn: async () => {
      const res = await getProductsBySeller();
      if (res.error) throw new Error(res.error);
      return res.success ? res.data.filter((product: Product & { media: MediaType[] }) => product.published) : [];
    },
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    const newParams = new URLSearchParams(window.location.search);
    searchValue ? newParams.set('search', searchValue) : newParams.delete('search');
    const newUrl = `${window.location.pathname}?${newParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  const filtered = useMemo(() => {
    return data?.filter((product: any) => product.name.toLowerCase().includes(search.toLowerCase())) || [];
  }, [search, data]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage);

  const handlePreviousPage = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage((prev) => prev + 1);

  const confirmDelete = (id: string) => {
    setProductIdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const onDeleteConfirm = async () => {
    if (!productIdToDelete) return;
    startTransition(async () => {
      const res = await removeFromMyProducts(productIdToDelete);
      if (res.success) {
        toast({
          variant: 'success',
          title: tValidation('success-title'),
          description: tValidation(res.success),
        });
      } else {
        toast({
          variant: 'destructive',
          title: tValidation('error-title'),
          description: tValidation(res.error),
        });
      }
    });
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="flex h-full w-full flex-col items-start justify-center space-y-6">
        <div className="flex w-full items-center space-x-4 rounded-md border border-border bg-background p-3">
          <IconInfoCircleFilled className="h-14 w-14 flex-shrink-0  text-primary" />
          <h1 className="text-sm text-muted-foreground">
            {t('my-products-info')}{' '}
            <Link href="/dashboard/marketplace" className="font-medium text-primary underline">
              Marketplace.
            </Link>
          </h1>
        </div>

        <div className="flex w-full flex-col items-center space-y-4 rounded-md border border-border bg-background p-3">
          <div className="relative flex w-full items-center gap-x-6">
            <Input
              className="h-12 w-full pl-12 text-sm"
              placeholder={tMarketplace('search')}
              value={search}
              onChange={handleSearchChange}
            />
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
            <Button variant="primary" onClick={() => router.push('/dashboard/seller/orders/add')}>
              <IconShoppingCart className="mr-2" />
              Nouvelle Commande
            </Button>
          </div>

          <div className="grid w-full grid-cols-2 gap-4 rounded-md border p-4 md:grid-cols-3 lg:grid-cols-4">
            {isLoading ? (
              <div className="col-span-2 flex h-full items-center justify-center py-24 text-primary md:col-span-4">
                <IconLoader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : currentItems.length > 0 ? (
              currentItems.map((product: any) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  imageHeight={180}
                  imageWidth={180}
                  profitMargin={product.profitMargin}
                  image={product.media[0].key}
                  name={product.name}
                  wholesalePrice={product.wholesalePrice}
                  category={product.category as productCategoryOptions}
                  stock={product.stock}
                  colors={product.colors}
                  showDeleteIcon={true}
                  onClickNavigate={false}
                  onDelete={() => confirmDelete(product.id)}
                />
              ))
            ) : (
              <p className="col-span-2 py-24 text-center text-sm text-muted-foreground md:col-span-4">
                {tMarketplace('my-products-no-results')}
              </p>
            )}
          </div>

          <div className="flex w-full justify-between">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="flex items-center gap-1">
              <IconChevronLeft />
              {tMarketplace('previous')}
            </Button>
            <p className="text-sm text-muted-foreground">
              Page {currentPage} {tMarketplace('of')} {totalPages}
            </p>
            <Button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="flex items-center gap-1">
              {tMarketplace('next')}
              <IconChevronRight />
            </Button>
          </div>
        </div>
      </div>

      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={onDeleteConfirm}
        isLoading={isDialogLoading}
      />
    </>
  );
}
