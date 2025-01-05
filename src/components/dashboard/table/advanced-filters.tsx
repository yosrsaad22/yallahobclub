import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { orderStatuses } from '@/lib/constants';
import { DataTableUser } from '@/types';
import { IconFilter, IconFilterOff } from '@tabler/icons-react';
import { Table } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { UserCombobox } from '../comboboxes/user-combobox';
import { getSellers, getSuppliers } from '@/actions/users';

interface AdvancedFiltersProps<TData> {
  tag: string;
  prefix: string;
  table: Table<TData>;
}

export function AdvancedFilters<TData extends { id: string }>({ tag, prefix, table }: AdvancedFiltersProps<TData>) {
  const t = useTranslations('dashboard.tables');
  const tFields = useTranslations('fields');
  const tStatuses = useTranslations('dashboard.order-statuses');

  const [selectedStatuses, setSelectedStatuses] = useState<{ UpdateCode: string; Color: string }[]>([]);
  const [suppliers, setSuppliers] = useState<DataTableUser[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [suppliersLoading, setSuppliersLoading] = useState<boolean>(false);

  const [sellers, setSellers] = useState<DataTableUser[]>([]);
  const [selectedSellers, setSelectedSellers] = useState<string[]>([]);
  const [sellersLoading, setSellersLoading] = useState<boolean>(false);

  // Fetch suppliers and sellers
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

    fetchSuppliers();
    fetchSellers();
  }, []);

  // Apply filters with useEffect
  useEffect(() => {
    const columnFilters = table.getState().columnFilters || [];
    const updatedFilters = columnFilters
      .filter((filter) => filter.id !== 'suppliers' && filter.id !== 'sellers' && filter.id !== 'statuses')
      .concat(
        selectedStatuses.length ? { id: 'statuses', value: selectedStatuses.map((s) => s.UpdateCode) } : [],
        selectedSuppliers.length ? { id: 'suppliers', value: selectedSuppliers } : [],
        selectedSellers.length ? { id: 'seller', value: selectedSellers } : [],
      );

    table.setColumnFilters(updatedFilters);
  }, [selectedStatuses, selectedSuppliers, selectedSellers, table]);

  const handleStatusChange = (status: { UpdateCode: string; Color: string }) => {
    setSelectedStatuses((prev) =>
      prev.some((s) => s.UpdateCode === status.UpdateCode)
        ? prev.filter((s) => s.UpdateCode !== status.UpdateCode)
        : [...prev, status],
    );
  };

  const handleSupplierChange = (supplierIds: string[]) => {
    setSelectedSuppliers(supplierIds);
  };

  const handleSellerChange = (sellerIds: string[]) => {
    setSelectedSellers(sellerIds);
  };

  const clearFilters = () => {
    setSelectedStatuses([]);
    setSelectedSuppliers([]);
    setSelectedSellers([]);
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

      <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3">
        <div className="col-span-2 flex flex-col gap-1 md:col-span-1">
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

        <div className="flex flex-col gap-1">
          <UserCombobox
            users={suppliers}
            selectedUserIds={selectedSuppliers}
            onSelectUsers={handleSupplierChange}
            placeholder={tFields('order-suppliers')}
            loading={suppliersLoading}
            multiSelect
          />
          {selectedSuppliers.length > 0 && (
            <p className="pl-2 text-xs text-muted-foreground">
              {selectedSuppliers.length} {t('applied-filters')}
            </p>
          )}
        </div>

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
      </div>
    </div>
  );
}
