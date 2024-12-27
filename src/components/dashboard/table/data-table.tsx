'use client';
import React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getFilteredRowModel,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTablePagination } from './pagination';
import { DataTableToolbar } from './toolbar';
import { useTranslations } from 'next-intl';
import { DataTableColumnHeader } from './column-header';
import { cn, translateColumnHeader } from '@/lib/utils';
import { CellAction } from './cell-actions';
import { DataTableHandlers } from '@/types';
import { useRouter } from '@/navigation';
import { useCurrentRole } from '@/hooks/use-current-role';
import { Checkbox } from '@/components/ui/checkbox';

interface DataTableProps<TData extends { id: string }, TValue> {
  tag: string;
  translationPrefix: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDelete: DataTableHandlers['onDelete'] | undefined;
  onBulkDelete: DataTableHandlers['onBulkDelete'] | undefined;
  onRequestPickup?: DataTableHandlers['onRequestPickup'] | undefined;
  onMarkAsPaid?: DataTableHandlers['onMarkAsPaid'] | undefined;
  onPrintPickup?: DataTableHandlers['onPrintPickup'] | undefined;
  onAddTransaction?: DataTableHandlers['onAddTransaction'] | undefined;
  onCustomRefresh?: DataTableHandlers['onCustomRefresh'] | undefined;
  redirectToDetails?: boolean;
  showActions?: boolean;
  showAddButton?: boolean;
  showBulkDeleteButton?: boolean;
  showCreatePickupButton?: boolean;
  showPrintPickupButton?: boolean;
  showMarkAsPaidButton?: boolean;
  showSelect?: boolean;
  showAddTransactionButton?: boolean;
}

export function DataTable<TData extends { id: string }, TValue>({
  tag,
  translationPrefix,
  columns,
  data,
  onDelete,
  onBulkDelete,
  onRequestPickup = undefined,
  onMarkAsPaid = undefined,
  onPrintPickup = undefined,
  onCustomRefresh = undefined,
  redirectToDetails = true,
  showActions = true,
  showAddButton = true,
  showSelect = true,
  showPrintPickupButton = false,
  showBulkDeleteButton = true,
  showCreatePickupButton = false,
  showAddTransactionButton = false,
  showMarkAsPaidButton = false,
  onAddTransaction = undefined,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  const t = useTranslations('dashboard.tables');
  const tFields = useTranslations('fields');
  const role = useCurrentRole();
  const router = useRouter();

  const toggleAllRowsSelected = (isChecked: boolean) => {
    const newRowSelection = isChecked ? Object.fromEntries(table.getRowModel().rows.map((row) => [row.id, true])) : {};
    setRowSelection(newRowSelection);
  };

  const selectColumn: ColumnDef<any> = {
    id: 'select',
    cell: ({ row }) =>
      showSelect ? (
        <div className="p-2">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="mr-2 h-5 w-5"
          />
        </div>
      ) : (
        <div className="h-1 w-1"></div>
      ),
    enableSorting: false,
    enableHiding: false,
  };
  columns = [selectColumn, ...columns];

  if (showActions) {
    const actionsColumn: ColumnDef<any> = {
      id: 'actions',
      cell: ({ row }) => <CellAction table={table} tag={tag} onDelete={onDelete} id={row.original.id} />,
    };

    columns = [...columns, actionsColumn];
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    rowCount: data.length,
    initialState: { pagination: { pageSize: 20 } },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      table.setPageSize(isMobile ? 8 : 20);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [isMobile, table]);

  return (
    <div className="space-y-4 pt-2">
      <DataTableToolbar
        prefix={translationPrefix}
        showAddButton={showAddButton}
        showBulkDeleteButton={showBulkDeleteButton}
        showCreatePickupButton={showCreatePickupButton}
        showPrintPickupButton={showPrintPickupButton}
        showAddTransactionButton={showAddTransactionButton}
        showMarkAsPaidButton={showMarkAsPaidButton}
        tag={tag}
        table={table}
        onBulkDelete={onBulkDelete}
        onRequestPickup={onRequestPickup}
        onPrintPickup={onPrintPickup}
        onAddTransaction={onAddTransaction}
        onMarkAsPaid={onMarkAsPaid}
        onCustomRefresh={onCustomRefresh}
      />
      <div className="custom-scrollbar overflow-x-auto rounded-md border bg-background">
        <div className="inline-block min-w-full align-middle">
          <Table className="min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const translatedTitle = translateColumnHeader(translationPrefix, header.id, tFields);
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : header.id === 'select' ? (
                          showSelect ? (
                            <div className="p-1">
                              <Checkbox
                                checked={table.getIsAllPageRowsSelected()}
                                onCheckedChange={(value) => toggleAllRowsSelected(!!value)}
                                aria-label="Select all rows"
                                className="ml-1 h-5 w-5"
                              />
                            </div>
                          ) : (
                            <div className=""></div>
                          )
                        ) : (
                          flexRender(
                            <DataTableColumnHeader column={header.column} title={translatedTitle} />,
                            header.getContext(),
                          )
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className={cn(redirectToDetails ? 'cursor-pointer' : 'pointer-events-auto')}
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onContextMenu={(e) => {
                      if (redirectToDetails) {
                        e.preventDefault(); // Prevent default context menu
                        const url = `/dashboard/${role?.toLowerCase()}/${tag}/${row.original.id}`;
                        window.open(url, '_blank'); // Open the link in a new tab
                      }
                    }}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        onClick={() => {
                          if (redirectToDetails) {
                            if (!cell.id.includes('actions') && !cell.id.includes('select')) {
                              router.push(`/dashboard/${role?.toLowerCase()}/${tag}/${row.original.id}`);
                            }
                          }
                        }}
                        className={cn(
                          !cell.id.includes('actions') && !cell.id.includes('select')
                            ? 'cursor-pointer'
                            : 'pointer-events-auto',
                        )}
                        key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-[150px] text-center">
                    {t('no-result')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
