'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { IconDots, IconId, IconTrash } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { DeleteDialog } from '../dialogs/delete-dialog';
import { ActionResponse, DataTableHandlers } from '@/types';
import React from 'react';
import { toast } from '@/components/ui/use-toast';
import { useCurrentRole } from '@/hooks/use-current-role';
import { useRouter } from '@/navigation';
import { Table } from '@tanstack/react-table';

interface CellActionProps {
  tag: string;
  table: Table<any>;
  id: any;
  onDelete: DataTableHandlers['onDelete'] | undefined;
}

export const CellAction: React.FC<CellActionProps> = ({ tag, table, id, onDelete }) => {
  const [isLoading, startTransition] = React.useTransition();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations('dashboard.tables');
  const tValidation = useTranslations('validation');

  const role = useCurrentRole();

  const onConfirm = async () => {
    startTransition(() => {
      if (onDelete) {
        onDelete(id).then((res: ActionResponse) => {
          table.setRowSelection({});
          if (res.success) {
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

  return (
    <>
      <DeleteDialog isOpen={open} onClose={() => setOpen(false)} onConfirm={onConfirm} isLoading={isLoading} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <IconDots className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="spacing-y-4 w-[150px] bg-background">
          <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push(`/dashboard/${role?.toLowerCase()}/${tag}/${id}`)}>
            <IconId className="mr-2 h-5 w-5" /> {t('details')}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive hover:text-destructive focus:text-destructive"
            onClick={() => setOpen(true)}>
            <IconTrash className="mr-2 h-5 w-5" /> {t('delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
