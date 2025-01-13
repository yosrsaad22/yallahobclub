import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { orderStatuses, roleOptions } from '@/lib/constants';
import { DataTableUser, MediaType } from '@/types';
import { IconFilter, IconFilterOff } from '@tabler/icons-react';
import { Table } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { UserCombobox } from '../comboboxes/user-combobox';
import { getSellers, getSuppliers } from '@/actions/users';
import { getProducts, getProductsBySeller, getProductsBySupplier } from '@/actions/products';
import { ProductFilterCombobox } from '../comboboxes/product-filter-combobox';
import { Product } from '@prisma/client';
import { translateColumnHeader } from '@/lib/utils';
import { DatePicker } from '@/components/ui/date-picker';
import { useCurrentRole } from '@/hooks/use-current-role';
import { ca } from 'date-fns/locale';

interface AdvancedFiltersProps<TData> {
  tag: string;
  prefix: string;
  table: Table<TData>;
}

export function AdvancedFilters<TData extends { id: string }>({ tag, prefix, table }: AdvancedFiltersProps<TData>) {
  const t = useTranslations('dashboard.tables');
  const tFields = useTranslations('fields');
  const tStatuses = useTranslations('dashboard.order-statuses');
  const role = useCurrentRole();

  const [selectedStatuses, setSelectedStatuses] = useState<{ UpdateCode: string; Color: string }[]>([]);
  const [suppliers, setSuppliers] = useState<DataTableUser[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [suppliersLoading, setSuppliersLoading] = useState<boolean>(false);

  const [sellers, setSellers] = useState<DataTableUser[]>([]);
  const [selectedSellers, setSelectedSellers] = useState<string[]>([]);
  const [sellersLoading, setSellersLoading] = useState<boolean>(false);

  const [products, setProducts] = useState<(Product & { media: MediaType[] })[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      setSuppliersLoading(true);
      const response = await getSuppliers();
      if (response.success) {
        setSuppliers(response.data || []);
      }
      setSuppliersLoading(false);
    };

    const fetchSellers = async () => {
      setSellersLoading(true);
      const response = await getSellers();
      if (response.success) {
        setSellers(response.data || []);
      }
      setSellersLoading(false);
    };

    const fetchProducts = async () => {
      setProductsLoading(true);
      let response;
      switch (role) {
        case roleOptions.ADMIN:
          response = await getProducts();
          break;
        case roleOptions.SUPPLIER:
          response = await getProductsBySupplier();
          break;
        case roleOptions.SELLER:
          response = await getProductsBySeller();
          break;
      }
      if (response && response.success) {
        setProducts(response.data || []);
      }
      setProductsLoading(false);
    };

    fetchSuppliers();
    fetchSellers();
    fetchProducts();
  }, [role]);

  useEffect(() => {
    const columnFilters = table.getState().columnFilters || [];
    const updatedFilters = columnFilters
      .filter((filter) => filter.id !== 'statuses' && filter.id !== 'sellers')
      .concat(
        selectedStatuses.length ? { id: 'statuses', value: selectedStatuses.map((s) => s.UpdateCode) } : [],
        selectedSellers.length ? { id: 'seller', value: selectedSellers } : [],
      );

    table.setColumnFilters(updatedFilters);
  }, [selectedStatuses, selectedSellers, table]);

  const handleStatusChange = (status: { UpdateCode: string; Color: string }) => {
    setSelectedStatuses((prev) =>
      prev.some((s) => s.UpdateCode === status.UpdateCode)
        ? prev.filter((s) => s.UpdateCode !== status.UpdateCode)
        : [...prev, status],
    );
  };

  const handleSuppliersChange = (supplierIdOrIds: string | string[]) => {
    const supplierIds = Array.isArray(supplierIdOrIds) ? supplierIdOrIds : [supplierIdOrIds];
    setSelectedSuppliers(supplierIds);

    const columnFilters = table.getState().columnFilters || [];
    const updatedFilters = columnFilters
      .filter((filter) => filter.id !== (tag === 'products' ? 'supplier' : 'suppliers'))
      .concat(supplierIds.length ? { id: tag === 'products' ? 'supplier' : 'suppliers', value: supplierIds } : []);

    table.setColumnFilters(updatedFilters);
  };

  const handleSellerChange = (sellerIds: string[]) => {
    setSelectedSellers(sellerIds);
  };

  const handleProductChange = (productIds: string[]) => {
    setSelectedProducts(productIds);

    const columnFilters = table.getState().columnFilters || [];
    const updatedFilters = columnFilters
      .filter((filter) => filter.id !== 'products')
      .concat(productIds.length ? { id: 'products', value: productIds } : []);

    table.setColumnFilters(updatedFilters);
  };

  const clearFilters = () => {
    table.setColumnFilters([]);
    setSelectedStatuses([]);
    setSelectedSuppliers([]);
    setSelectedSellers([]);
    setSelectedProducts([]);
    setSelectedDate(undefined);
    columns.forEach((column) => {
      if (!column.getIsVisible()) {
        column.toggleVisibility(true);
      }
    });
  };

  const columns = table
    .getAllColumns()
    .filter(
      (column) => typeof column.accessorFn !== 'undefined' && !column.columnDef.enableHiding && column.id !== 'media',
    )
    .map((column) => ({
      ...column,
      translatedName: translateColumnHeader(prefix, column.id, (key) => key),
    }));

  const visibleColumns = columns.filter((column) => column.getIsVisible());

  const handleColumnVisibilityChange = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (column) {
      column.toggleVisibility(!column.getIsVisible());
    }
  };

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    const columnFilters = table.getState().columnFilters || [];
    const updatedFilters = columnFilters
      .filter((filter) => filter.id !== 'createdAt')
      .concat(date ? { id: 'createdAt', value: date.toISOString() } : []);

    table.setColumnFilters(updatedFilters);
  };

  return (
    <div className="flex w-full flex-col gap-4 rounded-md border border-border bg-background p-4">
      <div className="flex w-full items-start justify-between">
        <div className="flex flex-col gap-4">
          <h1 className="flex flex-row items-center gap-4 font-semibold">
            <IconFilter />
            {t('advanced-filters-title')}
          </h1>
          <p className="text-sm text-muted-foreground">{t('advanced-filters-text')}</p>
        </div>
        <Button className="max-w-36 px-3" variant="destructive" onClick={clearFilters}>
          <IconFilterOff className="mr-0 h-5 w-5 md:mr-2" />
          <p className="hidden md:flex">{t('clear')}</p>
        </Button>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        {tag === 'orders' && (
          <div className={`flex flex-col  gap-1 md:col-span-1 `}>
            <Combobox
              items={orderStatuses}
              selectedItems={selectedStatuses}
              onSelect={handleStatusChange}
              placeholder={tFields('order-statuses')}
              displayValue={(item) => tStatuses(item.UpdateCode)}
              itemKey={(item) => item.UpdateCode}
              multiSelect
            />
            {selectedStatuses.length > 0 && (
              <p className="pl-2 text-xs text-muted-foreground">
                {selectedStatuses.length} {t('applied-filters')}
              </p>
            )}
          </div>
        )}
        {role === roleOptions.ADMIN && (
          <>
            {(tag === 'orders' || tag === 'products') && (
              <div className="flex flex-col gap-1">
                <UserCombobox
                  users={suppliers}
                  selectedUserIds={selectedSuppliers}
                  onSelectUsers={handleSuppliersChange}
                  placeholder={tFields(tag === 'orders' ? 'order-suppliers' : 'product-supplier')}
                  loading={suppliersLoading}
                  multiSelect
                />

                {selectedSuppliers.length > 0 && (
                  <p className="pl-2 text-xs text-muted-foreground">
                    {selectedSuppliers.length} {t('applied-filters')}
                  </p>
                )}
              </div>
            )}

            {tag === 'orders' && (
              <div className="flex flex-col gap-1">
                <UserCombobox
                  users={sellers}
                  selectedUserIds={selectedSellers}
                  onSelectUsers={handleSellerChange}
                  placeholder={tFields('order-sellers')}
                  loading={sellersLoading}
                  multiSelect
                />
                {selectedSellers.length > 0 && (
                  <p className="pl-2 text-xs text-muted-foreground">
                    {selectedSellers.length} {t('applied-filters')}
                  </p>
                )}
              </div>
            )}
          </>
        )}
        {tag === 'orders' && (
          <div className="flex flex-col gap-1">
            <ProductFilterCombobox
              products={products}
              selectedProductIds={selectedProducts}
              onSelectProducts={handleProductChange}
              onSelectProduct={(productId) => setSelectedProducts([productId])}
              placeholder={tFields('order-products')}
              loading={productsLoading}
              multiSelect
            />

            {selectedProducts.length > 0 && (
              <p className="pl-2 text-xs text-muted-foreground">
                {selectedProducts.length} {t('applied-filters')}
              </p>
            )}
          </div>
        )}
        {(tag === 'orders' || (tag === 'products' && role === roleOptions.ADMIN)) && (
          <>
            <div className="flex flex-col gap-1">
              <Combobox
                items={columns}
                selectedItems={visibleColumns}
                multiSelect
                onSelect={(column) => handleColumnVisibilityChange(column.id)}
                placeholder={t('select-column')}
                displayValue={(column) => tFields(column.translatedName)}
                itemKey={(column) => column.id}
              />
            </div>

            <div className={`flex flex-col gap-1 md:col-span-1 ${tag === 'products' ? 'col-span-2' : 'col-span-1'}`}>
              <DatePicker selectedDate={selectedDate} onDateChange={handleDateChange} />
              {selectedDate && <p className="pl-2 text-xs text-muted-foreground">1 {t('applied-filters')}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
