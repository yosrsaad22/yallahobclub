'use client';
import { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';
import { IconDeviceFloppy, IconLoader2 } from '@tabler/icons-react';
import z from 'zod';
import { WithdrawRequestSchema } from '@/schemas';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LabelInputContainer } from '@/components/ui/label-input-container';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ActionResponse, DataTableUser } from '@/types';
import { UserCombobox } from '../comboboxes/user-combobox';
import { getUsers } from '@/actions/users';
import { useCurrentUser } from '@/hooks/use-current-user';
import { toast } from '@/components/ui/use-toast';

interface AddWithdrawRequestDialogProps {
  onWithdrawRequestAdd: (data: any) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
}

export const AddWithdrawRequestDialog: React.FC<AddWithdrawRequestDialogProps> = ({
  onWithdrawRequestAdd,
  isOpen,
  onClose,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  const [isLoading, startTransition] = useTransition();
  const tPages = useTranslations('dashboard.pages');
  const t = useTranslations('dashboard.text');
  const tFields = useTranslations('fields');
  const tValidation = useTranslations('validation');
  const user = useCurrentUser();

  type schemaType = z.infer<typeof WithdrawRequestSchema>;

  const defaultValues = {
    userId: user?.id,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    clearErrors,
  } = useForm<schemaType>({ resolver: zodResolver(WithdrawRequestSchema), defaultValues });

  const onSubmit: SubmitHandler<schemaType> = async (data, event) => {
    event?.preventDefault();
    if (parseFloat(data.amount) > user?.balance!) {
      toast({
        variant: 'primary',
        title: tValidation('info-title'),
        description: tValidation('withdraw-request-insufficient-balance-error'),
      });
      return;
    }
    if (parseFloat(data.amount) < 50) {
      toast({
        variant: 'primary',
        title: tValidation('info-title'),
        description: tValidation('withdraw-request-minimal-amount-error'),
      });
      return;
    }
    startTransition(async () => {
      const res = await onWithdrawRequestAdd(data);
      setTimeout(() => {
        handleClose();
      }, 500);
      return res;
    });
  };
  const handleClose = async () => {
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
    <Dialog
      title={t('withdraw-request-add')}
      description={t('withdraw-request-add-note')}
      isOpen={isOpen}
      onClose={() => handleClose()}>
      <div className="flex h-full w-full flex-col items-center overflow-y-auto overflow-x-hidden">
        <form className="flex w-full flex-col space-y-6 p-1" onSubmit={handleSubmit(onSubmit)}>
          <LabelInputContainer>
            <Label htmlFor="amount">{tFields('withdraw-amount')}</Label>
            <Input
              {...register('amount')}
              id="amount"
              disabled={isLoading}
              placeholder={tFields('withdraw-amount')}
              type="text"
            />
            {errors.amount && (
              <span className="text-xs text-red-400">{tValidation('withdraw-request-amount-error')}</span>
            )}
          </LabelInputContainer>
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
