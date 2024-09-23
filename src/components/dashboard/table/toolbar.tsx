'use client';

import { Table } from '@tanstack/react-table';
import { Button, LinkButton } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './view-options';
import { IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useCurrentRole } from '@/hooks/use-current-role';
import { ActionResponse, DataTableHandlers } from '@/types';
import { DeleteDialog } from '../dialogs/delete-dialog';
import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from '@/navigation';

interface DataTableToolbarProps<TData> {
  tag: string;
  prefix: string;
  table: Table<TData>;
  onBulkDelete: DataTableHandlers['onBulkDelete'] | undefined;
  showAddButton: boolean;
}

export function DataTableToolbar<TData extends { id: string }>({
  tag,
  prefix,
  table,
  onBulkDelete,
  showAddButton = true,
}: DataTableToolbarProps<TData>) {
  const t = useTranslations('dashboard.tables');
  const tValidation = useTranslations('validation');
  const role = useCurrentRole();
  const [isLoading, startTransition] = React.useTransition();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {
    startTransition(() => {
      const ids: string[] = [];
      const selectedRows = table.getSelectedRowModel().rows;
      selectedRows.forEach((row) => {
        ids.push(row.original.id);
      });
      if (onBulkDelete) {
        onBulkDelete(ids).then((res: ActionResponse) => {
          if (res.success) {
            table.setRowSelection({});
            setOpen(false);
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
      <DeleteDialog isOpen={open} onClose={() => setOpen(false)} onConfirm={onConfirm} isLoading={isLoading} />
      <div className="z-[10] flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder={t('search')}
            value={(table.getState().globalFilter as string) ?? ''}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="h-11 w-[150px] lg:w-[250px]"
          />
          {((allRowsSelected && rows > 0) || (someRowsSelected && rows > 0)) && (
            <Button onClick={() => setOpen(true)} variant="destructive" size="default" className="ml-auto  lg:flex">
              <IconTrash className="mr-2 h-5 w-5" />
              {t('delete')} {table.getSelectedRowModel().flatRows.length} {t('elements')}
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
