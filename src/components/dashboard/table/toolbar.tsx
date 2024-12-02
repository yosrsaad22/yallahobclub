'use client';

import { Table } from '@tanstack/react-table';
import { Button, LinkButton } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './view-options';
import {
  IconChecklist,
  IconLoader2,
  IconPlus,
  IconPrinter,
  IconReceipt,
  IconReceipt2,
  IconRefresh,
  IconTransactionDollar,
  IconTrash,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useCurrentRole } from '@/hooks/use-current-role';
import { ActionResponse, DataTableHandlers } from '@/types';
import { DeleteDialog } from '../dialogs/delete-dialog';
import React, { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from '@/navigation';
import { RequestPickupDialog } from '../dialogs/request-pickup-dialog';
import { AddTransactionDialog } from '../dialogs/add-transaction-dialog';
import { MarkAsPaidDialog } from '../dialogs/mark-as-paid-dialog';

interface DataTableToolbarProps<TData> {
  tag: string;
  prefix: string;
  table: Table<TData>;
  onBulkDelete: DataTableHandlers['onBulkDelete'] | undefined;
  onRequestPickup: DataTableHandlers['onRequestPickup'] | undefined;
  onPrintPickup: DataTableHandlers['onPrintPickup'] | undefined;
  onMarkAsPaid: DataTableHandlers['onMarkAsPaid'] | undefined;

  onAddTransaction: DataTableHandlers['onAddTransaction'] | undefined;
  showAddTransactionButton?: boolean;
  showAddButton: boolean;
  showBulkDeleteButton?: boolean;
  showCreatePickupButton?: boolean;
  showPrintPickupButton?: boolean;
  showMarkAsPaidButton?: boolean;
}

export function DataTableToolbar<TData extends { id: string }>({
  tag,
  prefix,
  table,
  onBulkDelete,
  onRequestPickup,
  onPrintPickup,
  onAddTransaction,
  onMarkAsPaid,
  showAddButton = true,
  showBulkDeleteButton = true,
  showCreatePickupButton = false,
  showMarkAsPaidButton = false,
  showPrintPickupButton = false,
  showAddTransactionButton = false,
}: DataTableToolbarProps<TData>) {
  const t = useTranslations('dashboard.tables');
  const tValidation = useTranslations('validation');
  const role = useCurrentRole();
  const [isDeleteLoading, startDeleteTransition] = React.useTransition();
  const [isPickupLoading, startPickupTransition] = React.useTransition();
  const [isMarkAsPaidLoading, startMarkAsPaidTransition] = React.useTransition();

  const [isPrintPickupLoading, startPrintPickupTransition] = React.useTransition();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isPickupDialogOpen, setPickupDialogOpen] = useState(false);
  const [isMarkAsPaidDialogOpen, setMarkAsPaidDialogOpen] = useState(false);

  const [isTransactionDialogOpen, setTransactionDialogOpen] = useState(false);

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
          setDeleteDialogOpen(false);
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
            router.refresh();
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

  const handlePrintPickup = async () => {
    startPrintPickupTransition(() => {
      const ids: string[] = [];
      const selectedRows = table.getSelectedRowModel().rows;
      selectedRows.forEach((row) => {
        ids.push(row.original.id);
      });
      if (onPrintPickup) {
        onPrintPickup(selectedRows[0].original.id).then((res: ActionResponse) => {
          if (res.success) {
            table.setRowSelection({});
            toast({
              variant: 'success',
              title: tValidation('success-title'),
              description: tValidation(res.success),
            });

            const bytes = new Uint8Array(res.data);
            const blob = new Blob([bytes], { type: 'application/pdf' });
            const docUrl = URL.createObjectURL(blob);
            window.open(docUrl, '_blank');
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

  const handleAddTransaction = async (userId: string, amount: string) => {
    startPrintPickupTransition(() => {
      if (onAddTransaction) {
        onAddTransaction(userId, amount).then((res: ActionResponse) => {
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
          return res;
        });
      }
    });
  };

  const onMarkAsPaidConfirm = async () => {
    startMarkAsPaidTransition(() => {
      const ids: string[] = [];
      const selectedRows = table.getSelectedRowModel().rows;
      selectedRows.forEach((row) => {
        ids.push(row.original.id);
      });
      if (onMarkAsPaid) {
        onMarkAsPaid(ids).then((res: ActionResponse) => {
          setMarkAsPaidDialogOpen(false);
          if (res.success) {
            table.setRowSelection({});
            toast({
              variant: 'success',
              title: tValidation('success-title'),
              description: tValidation(res.success),
            });
            router.refresh();
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
      <MarkAsPaidDialog
        orderNumber={table.getSelectedRowModel().flatRows.length.toString()}
        isOpen={isMarkAsPaidDialogOpen}
        onClose={() => setMarkAsPaidDialogOpen(false)}
        onConfirm={onMarkAsPaidConfirm}
        isLoading={isMarkAsPaidLoading}
      />
      <AddTransactionDialog
        isOpen={isTransactionDialogOpen}
        onClose={() => setTransactionDialogOpen(false)}
        onTransactionAdd={handleAddTransaction}
      />
      <div className="z-[10] flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder={t('search')}
            value={(table.getState().globalFilter as string) ?? ''}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="h-11 w-[40%]"
          />

          {((allRowsSelected && rows > 0 && showBulkDeleteButton) ||
            (someRowsSelected && rows > 0 && showBulkDeleteButton)) && (
            <Button
              onClick={() => setDeleteDialogOpen(true)}
              variant="destructive"
              size="default"
              disabled={isDeleteLoading}
              className="ml-auto px-4 lg:flex">
              <IconTrash className="mr-0 h-5 w-5 md:mr-2" />
              <p className="hidden md:flex">
                {t('delete')} {table.getSelectedRowModel().flatRows.length} {t('elements')}
              </p>
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
              disabled={isPickupLoading}
              className="ml-auto px-4  lg:flex">
              <IconChecklist className="mr-0 h-5 w-5 md:mr-2" />
              <p className="hidden md:flex">
                {t('pickup')} ({table.getSelectedRowModel().flatRows.length})
              </p>
            </Button>
          )}
          {showMarkAsPaidButton && (
            <Button
              onClick={() => {
                if ((allRowsSelected && rows > 0) || (someRowsSelected && rows > 0)) {
                  setMarkAsPaidDialogOpen(true);
                } else {
                  toast({
                    variant: 'primary',
                    title: tValidation('info-title'),
                    description: tValidation('mark-as-paid-no-orders'),
                  });
                }
              }}
              variant="success"
              size="default"
              disabled={isMarkAsPaidLoading}
              className="ml-auto px-5  lg:flex">
              <IconTransactionDollar className="mr-0 h-5 w-5 md:mr-2" />
              <p className="hidden md:flex">
                {t('mark-as-paid')} ({table.getSelectedRowModel().flatRows.length})
              </p>
            </Button>
          )}
          {showAddTransactionButton && (
            <Button
              onClick={() => {
                setTransactionDialogOpen(true);
              }}
              variant="primary"
              size="default"
              disabled={isPickupLoading}
              className="ml-auto px-4  lg:flex">
              <IconReceipt2 className="mr-0 h-5 w-5 md:mr-2" />
              <p className="hidden md:flex">{t('add-transaction')}</p>
            </Button>
          )}
          {showPrintPickupButton && (
            <Button
              onClick={() => {
                const selectedRows = table.getSelectedRowModel().flatRows;
                if (selectedRows.length === 1) {
                  handlePrintPickup();
                } else {
                  toast({
                    variant: 'primary',
                    title: tValidation('info-title'),
                    description: tValidation('print-pickup-select-one'),
                  });
                }
              }}
              variant="primary"
              size="default"
              disabled={isPrintPickupLoading}
              className="ml-auto px-4  lg:flex">
              {isPrintPickupLoading ? (
                <IconLoader2 className="mr-0 h-5 w-5 animate-spin md:mr-2" />
              ) : (
                <IconPrinter className="mr-0 h-5 w-5 md:mr-2" />
              )}{' '}
              <p className="hidden md:flex">
                {t('print-pickup')} ({table.getSelectedRowModel().flatRows.length})
              </p>
            </Button>
          )}
        </div>
        <div className="flex flex-row items-center space-x-2">
          {showAddButton && (
            <LinkButton
              className="px-4"
              variant="default"
              size="default"
              href={`/dashboard/${role?.toLowerCase()}/${tag}/add`}>
              <IconPlus className="mr-0 h-5 w-5 md:mr-2" />
              <p className="hidden md:flex">{t('add')}</p>
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
            className=" relative"
            variant={'outline'}
            size={'icon'}>
            <IconRefresh className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
    </>
  );
}
