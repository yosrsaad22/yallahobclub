'use client';

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { translateColumnHeader } from '@/lib/utils';

interface DataTableViewOptionsProps<TData> {
  prefix: string;
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({ prefix, table }: DataTableViewOptionsProps<TData>) {
  const t = useTranslations('dashboard.tables');
  const tFields = useTranslations('fields');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="default" className="ml-auto hidden px-3 lg:flex">
          <IconAdjustmentsHorizontal className="mr-2 h-5 w-5" />
          {t('view')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] bg-background">
        {table
          .getAllColumns()
          .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
          .map((column) => {
            const translatedTitle = translateColumnHeader(prefix, column.id, tFields);

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value: any) => column.toggleVisibility(!!value)}>
                {translatedTitle}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
