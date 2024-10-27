'use client';

import { Table } from '@tanstack/react-table';
import { Button, LinkButton } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './view-options';
import { IconChecklist, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useCurrentRole } from '@/hooks/use-current-role';
import { ActionResponse, DataTableHandlers } from '@/types';
import { DeleteDialog } from '../dialogs/delete-dialog';
import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from '@/navigation';
import { RequestPickupDialog } from '../dialogs/request-pickup-dialog';

interface DataTableToolbarProps<TData> {
  tag: string;
  prefix: string;
  table: Table<TData>;
  onBulkDelete: DataTableHandlers['onBulkDelete'] | undefined;
  onRequestPickup: DataTableHandlers['onRequestPickup'] | undefined;
  showAddButton: boolean;
  showBulkDeleteButton?: boolean;
  showCreatePickupButton?: boolean;
}

export function DataTableToolbar<TData extends { id: string }>({
  tag,
  prefix,
  table,
  onBulkDelete,
  onRequestPickup,
  showAddButton = true,
  showBulkDeleteButton = true,
  showCreatePickupButton = false,
}: DataTableToolbarProps<TData>) {
  const t = useTranslations('dashboard.tables');
  const tValidation = useTranslations('validation');
  const role = useCurrentRole();
  const [isDeleteLoading, startDeleteTransition] = React.useTransition();
  const [isPickupLoading, startPickupTransition] = React.useTransition();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isPickupDialogOpen, setPickupDialogOpen] = useState(false);

  const router = useRouter();

  const onDeleteConfirm = async () => {
    startDeleteTransition(() => {
      const ids: string[] = [];
      const selectedRows = table.getSelectedRowModel().rows;
      selectedRows.forEach((row) => {
        ids.push(row.original.id);
      });
      if (onBulkDelete) {
        onBulkDelete(ids).then((res: ActionResponse) => {
          setPickupDialogOpen(false);
          if (res.success) {
            table.setRowSelection({});
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
      }
    });
  };

  const onPickupConfirm = async () => {
    startPickupTransition(() => {
      const ids: string[] = [];
      const selectedRows = table.getSelectedRowModel().rows;
      selectedRows.forEach((row) => {
        ids.push(row.original.id);
      });
      if (onRequestPickup) {
        onRequestPickup(ids).then((res: ActionResponse) => {
          setPickupDialogOpen(false);
          if (res.success) {
            table.setRowSelection({});
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
      }
    });
  };

  const rows = table.getRowModel().rows.length;
  const allRowsSelected = table.getRowModel().rows.length === table.getSelectedRowModel().flatRows.length;
  const someRowsSelected = table.getIsSomeRowsSelected();

  return (
    <>
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={onDeleteConfirm}
        isLoading={isDeleteLoading}
      />
      <RequestPickupDialog
        orderNumber={table.getSelectedRowModel().flatRows.length.toString()}
        isOpen={isPickupDialogOpen}
        onClose={() => setPickupDialogOpen(false)}
        onConfirm={onPickupConfirm}
        isLoading={isPickupLoading}
      />
      <div className="z-[10] flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder={t('search')}
            value={(table.getState().globalFilter as string) ?? ''}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="h-11 w-[50%]"
          />

          {((allRowsSelected && rows > 0 && showBulkDeleteButton) ||
            (someRowsSelected && rows > 0 && showBulkDeleteButton)) && (
            <Button
              onClick={() => setDeleteDialogOpen(true)}
              variant="destructive"
              size="default"
              className="ml-auto  lg:flex">
              <IconTrash className="mr-2 h-5 w-5" />
              {t('delete')} {table.getSelectedRowModel().flatRows.length} {t('elements')}
            </Button>
          )}
          {showCreatePickupButton && (
            <Button
              onClick={() => {
                if ((allRowsSelected && rows > 0) || (someRowsSelected && rows > 0)) {
                  setPickupDialogOpen(true);
                } else {
                  toast({
                    variant: 'primary',
                    title: tValidation('info-title'),
                    description: tValidation('pickup-no-orders'),
                  });
                }
              }}
              variant="primary"
              size="default"
              className="ml-auto  lg:flex">
              <IconChecklist className="mr-2 h-5 w-5" />
              {t('pickup')} ({table.getSelectedRowModel().flatRows.length})
            </Button>
          )}
        </div>
        <div className="flex flex-row items-center space-x-2">
          {showAddButton && (
            <LinkButton variant="default" size="default" href={`/dashboard/${role?.toLowerCase()}/${tag}/add`}>
              <IconPlus className="mr-2 h-5 w-5" />
              {t('add')}
            </LinkButton>
          )}
          <DataTableViewOptions prefix={prefix} table={table} />
          <Button
            onClick={() => {
              setIsRefreshing(true);
              router.refresh();
              setTimeout(() => {
                setIsRefreshing(false);
              }, 1000);
            }}
            className="relative"
            variant={'outline'}
            size={'icon'}>
            <IconRefresh className={`${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
    </>
  );
}
