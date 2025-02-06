'use client';

import { Table } from '@tanstack/react-table';
import { Button, LinkButton } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  IconChecklist,
  IconFilter,
  IconLoader2,
  IconPlus,
  IconPrinter,
  IconReceipt,
  IconReceipt2,
  IconRefresh,
  IconTicket,
  IconTransactionDollar,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useCurrentRole } from '@/hooks/use-current-role';
import { ActionResponse, DataTableHandlers, DataTableUser } from '@/types';
import { DeleteDialog } from '../dialogs/delete-dialog';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from '@/navigation';
import { RequestPickupDialog } from '../dialogs/request-pickup-dialog';
import { AddTransactionDialog } from '../dialogs/add-transaction-dialog';
import { MarkAsPaidDialog } from '../dialogs/mark-as-paid-dialog';
import { AdvancedFilters } from './advanced-filters';
import { AnimatePresence, motion } from 'framer-motion';
import { roleOptions } from '@/lib/constants';

interface DataTableToolbarProps<TData> {
  tag: string;
  prefix: string;
  table: Table<TData>;
  onBulkDelete: DataTableHandlers['onBulkDelete'] | undefined;
  onRequestPickup: DataTableHandlers['onRequestPickup'] | undefined;
  onPrintPickups: DataTableHandlers['onPrintPickups'] | undefined;
  onMarkAsPaid: DataTableHandlers['onMarkAsPaid'] | undefined;
  onAddTransaction: DataTableHandlers['onAddTransaction'] | undefined;
  onPrintLabels: DataTableHandlers['onPrintLabels'] | undefined;
  showAddTransactionButton?: boolean;
  showAddButton: boolean;
  showBulkDeleteButton?: boolean;
  showCreatePickupButton?: boolean;
  showPrintPickupsButton?: boolean;
  showMarkAsPaidButton?: boolean;
  showPrintLabelsButton: boolean;
}

export function DataTableToolbar<TData extends { id: string }>({
  tag,
  prefix,
  table,
  onBulkDelete,
  onRequestPickup,
  onPrintPickups,
  onAddTransaction,
  onMarkAsPaid,
  onPrintLabels,
  showAddButton = true,
  showBulkDeleteButton = true,
  showCreatePickupButton = false,
  showMarkAsPaidButton = false,
  showPrintPickupsButton = false,
  showAddTransactionButton = false,
  showPrintLabelsButton = false,
}: DataTableToolbarProps<TData>) {
  const t = useTranslations('dashboard.tables');
  const tValidation = useTranslations('validation');
  const role = useCurrentRole();
  const [isDeleteLoading, startDeleteTransition] = React.useTransition();
  const [isPickupLoading, startPickupTransition] = React.useTransition();
  const [isMarkAsPaidLoading, startMarkAsPaidTransition] = React.useTransition();

  const [isPrintPickupLoading, startPrintPickupTransition] = React.useTransition();
  const [isPrintLabelsLoading, startPrintLabelsTransition] = React.useTransition();
  const [users, setUsers] = useState<DataTableUser[]>([]);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isPickupDialogOpen, setPickupDialogOpen] = useState(false);
  const [isMarkAsPaidDialogOpen, setMarkAsPaidDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [containerHeight, setContainerHeight] = useState<number | 'auto'>('auto');
  const containerRef = useRef<HTMLDivElement>(null);
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

  const handlePrintPickups = async () => {
    startPrintPickupTransition(() => {
      const ids: string[] = [];
      const selectedRows = table.getSelectedRowModel().rows;
      selectedRows.forEach((row) => {
        ids.push(row.original.id);
      });
      if (onPrintPickups) {
        onPrintPickups(ids).then((res: ActionResponse) => {
          if (res.success) {
            table.setRowSelection({});
            toast({
              variant: 'success',
              title: tValidation('success-title'),
              description: tValidation(res.success),
            });

            window.open(res.data, '_blank');
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

  const handlePrintLabels = async () => {
    startPrintLabelsTransition(() => {
      const ids: string[] = [];
      const selectedRows = table.getSelectedRowModel().rows;
      selectedRows.forEach((row) => {
        ids.push(row.original.id);
      });
      if (onPrintLabels) {
        onPrintLabels(ids).then((res: ActionResponse) => {
          if (res.success) {
            table.setRowSelection({});
            toast({
              variant: 'success',
              title: tValidation('success-title'),
              description: tValidation(res.success),
            });

            window.open(res.data, '_blank');
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

  const toggleFilters = () => {
    if (showAdvancedFilters && containerRef.current) {
      // Measure the height before hiding
      setContainerHeight(containerRef.current.offsetHeight);
    }
    setShowAdvancedFilters((prev) => !prev);
  };

  useEffect(() => {
    if (showAdvancedFilters) {
      // Reset height to auto when shown
      setContainerHeight('auto');
    }
  }, [showAdvancedFilters]);

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
      <div className="flex w-full flex-col gap-y-4">
        <div className="flex flex-col items-start justify-between gap-x-16 gap-y-4  md:flex-row md:items-center">
          <div className="flex w-full items-center gap-x-2 ">
            <Input
              placeholder={t('search')}
              value={(table.getState().globalFilter as string) ?? ''}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              className="h-11 w-full"
            />
            {(tag === 'orders' || (tag === 'products' && role === roleOptions.ADMIN)) && (
              <Button
                className="px-3"
                variant={'outline'}
                size={'default'}
                onClick={() => {
                  toggleFilters();
                }}>
                <IconFilter className="mr-0 h-5 w-5 md:mr-2" />
                <p className="hidden md:flex">{t('filter')}</p>
              </Button>
            )}
          </div>
          <div className="flex w-full flex-row items-center justify-end space-x-2 ">
            {((allRowsSelected && rows > 0 && showBulkDeleteButton) ||
              (someRowsSelected && rows > 0 && showBulkDeleteButton)) && (
              <Button
                onClick={() => setDeleteDialogOpen(true)}
                variant="destructive"
                size="default"
                disabled={isDeleteLoading}
                className="ml-auto px-3 lg:flex">
                <IconTrash className="mr-0 h-5 w-5 md:mr-2" />
                <p className="hidden md:flex">
                  {t('delete')} {table.getSelectedRowModel().flatRows.length} {t('elements')}
                </p>
              </Button>
            )}
            {showAddButton && (
              <LinkButton
                className="px-3"
                variant="primary"
                size="default"
                href={`/dashboard/${role?.toLowerCase()}/${tag}/add`}>
                <IconPlus className="mr-0 h-5 w-5 md:mr-2" />
                <p className="hidden md:flex">{t('add')}</p>
              </LinkButton>
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
                      description: tValidation('request-pickup-no-orders'),
                    });
                  }
                }}
                variant="outline"
                size="default"
                disabled={isPickupLoading}
                className="ml-auto px-3  lg:flex">
                <IconChecklist className="mr-0 h-5 w-5 md:mr-2" />
                <p className="hidden md:flex">
                  {t('pickup')} ({table.getSelectedRowModel().flatRows.length})
                </p>
              </Button>
            )}
            {showPrintLabelsButton && (
              <Button
                className=" px-3"
                onClick={(event) => {
                  event.preventDefault();
                  if ((allRowsSelected && rows > 0) || (someRowsSelected && rows > 0)) {
                    handlePrintLabels();
                  } else {
                    toast({
                      variant: 'primary',
                      title: tValidation('info-title'),
                      description: tValidation('print-labels-no-orders'),
                    });
                  }
                }}
                variant={'outline'}>
                {isPrintLabelsLoading ? (
                  <IconLoader2 className="mr-0 h-5 w-5 animate-spin md:mr-2 " />
                ) : (
                  <IconTicket className="mr-0 h-5 w-5 md:mr-2 " />
                )}
                <p className="hidden md:flex">
                  {t('print-labels')} ({table.getSelectedRowModel().flatRows.length})
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
                variant="outline"
                size="default"
                disabled={isMarkAsPaidLoading}
                className="ml-auto px-3  lg:flex">
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
                className="ml-auto px-3  lg:flex">
                <IconReceipt2 className="mr-0 h-5 w-5 md:mr-2" />
                <p className="hidden md:flex">{t('add-transaction')}</p>
              </Button>
            )}
            {showPrintPickupsButton && (
              <Button
                onClick={() => {
                  if ((allRowsSelected && rows > 0) || (someRowsSelected && rows > 0)) {
                    handlePrintPickups();
                  } else {
                    toast({
                      variant: 'primary',
                      title: tValidation('info-title'),
                      description: tValidation('print-pickups-no-pickups'),
                    });
                  }
                }}
                variant="primary"
                size="default"
                disabled={isPrintPickupLoading}
                className="ml-auto px-3  lg:flex">
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
            <Button
              onClick={() => {
                setIsRefreshing(true);

                router.refresh();
                setTimeout(() => {
                  setIsRefreshing(false);
                }, 1500);
              }}
              className="relative px-3"
              variant={'outline'}>
              {' '}
              <IconRefresh className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        {(tag === 'orders' || (tag === 'products' && role === roleOptions.ADMIN)) && (
          <motion.div
            style={{ height: containerHeight }}
            animate={{ height: showAdvancedFilters ? 'auto' : 0 }}
            transition={{ duration: 0.3 }}>
            <AnimatePresence>
              {showAdvancedFilters && (
                <motion.div
                  key="advanced-filters"
                  ref={containerRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}>
                  <AdvancedFilters table={table} tag={tag} prefix={prefix} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </>
  );
}
