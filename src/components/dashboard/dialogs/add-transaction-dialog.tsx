'use client';
import { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';
import { IconDeviceFloppy, IconLoader2 } from '@tabler/icons-react';
import z from 'zod';
import { TransactionSchema } from '@/schemas';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LabelInputContainer } from '@/components/ui/label-input-container';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ActionResponse, DataTableUser } from '@/types';
import { UserCombobox } from '../comboboxes/user-combobox';
import { getUsers } from '@/actions/users';

interface AddTransactionDialogProps {
  onTransactionAdd: (userId: string, amount: string) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
}

export const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({ onTransactionAdd, isOpen, onClose }) => {
  const [isMounted, setIsMounted] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [users, setUsers] = useState<DataTableUser[]>([]);
  const [usersLoading, setUsersLoading] = useState<boolean>(false);

  const [isLoading, startTransition] = useTransition();
  const tPages = useTranslations('dashboard.pages');
  const t = useTranslations('dashboard.text');
  const tFields = useTranslations('fields');
  const tValidation = useTranslations('validation');

  type schemaType = z.infer<typeof TransactionSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    clearErrors,
  } = useForm<schemaType>({ resolver: zodResolver(TransactionSchema) });

  useEffect(() => {
    const fetchUsers = async () => {
      setUsersLoading(true);
      const response = await getUsers();
      if (response.success) {
        setUsers(response.data || []);
      }
      setUsersLoading(false);
    };
    fetchUsers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit: SubmitHandler<schemaType> = async (data, event) => {
    event?.preventDefault();
    startTransition(async () => {
      await onTransactionAdd(data.userId, data.amount);
      setTimeout(() => {
        handleClose();
      }, 500);
    });
  };
  const handleClose = async () => {
    setSelectedUserId('');
    reset();
    clearErrors();
    onClose();
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog classname="h-[58%]" title={t('transaction-add')} isOpen={isOpen} onClose={() => handleClose()}>
      <div className="flex h-full w-full flex-col items-center overflow-y-auto overflow-x-hidden py-2 pt-6">
        <form className="flex w-full flex-col space-y-6 p-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6">
            <LabelInputContainer>
              <Label htmlFor="recipient">{tFields('transaction-user')}</Label>
              <UserCombobox
                customContentClassNames="mt-2"
                users={users}
                selectedUserId={selectedUserId}
                onSelectUser={(userId: string) => {
                  setSelectedUserId(userId);
                  setValue('userId', userId);
                }}
                placeholder={tFields('transaction-user-placeholder')}
                loading={usersLoading}
              />
              {errors.userId && <span className="text-xs text-red-400">{tValidation('transaction-user-error')}</span>}
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="amount">{tFields('transaction-amount')}</Label>
              <Input
                {...register('amount')}
                id="amount"
                disabled={isLoading}
                placeholder={tFields('transaction-amount')}
                type="text"
              />
              {errors.amount && <span className="text-xs text-red-400">{tValidation('transaction-amount-error')}</span>}
            </LabelInputContainer>
          </div>
          <div className="flex w-full items-center justify-center space-x-2 pt-4 ">
            <Button className="h-12" size="default" disabled={isLoading}>
              {isLoading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
              {!isLoading && <IconDeviceFloppy className="mr-2 h-5 w-5 " />}
              {t('save-button')}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};
