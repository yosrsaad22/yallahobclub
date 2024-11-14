'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';
import { IconLoader2 } from '@tabler/icons-react';

interface ConfirmWithdrawRequestActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  actionType: 'approve' | 'decline';
  amount: number | string;
  userName: string;
}

export const ConfirmWithdrawRequestActionDialog: React.FC<ConfirmWithdrawRequestActionDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  actionType,
  amount,
  userName,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations('dashboard');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const isApprove = actionType === 'approve';
  const title = isApprove ? t('dialogs.approve-title') : t('dialogs.decline-title');
  amount = amount + ' TND';
  const description = isApprove
    ? t('dialogs.approve-text', { amount, userName })
    : t('dialogs.decline-text', { amount, userName });
  const confirmButtonText = isApprove ? t('dialogs.approve') : t('dialogs.decline');

  return (
    <Dialog title={title} description={description} isOpen={isOpen} onClose={onClose}>
      <div className="flex w-full items-center justify-center space-x-2 md:justify-end">
        <Button disabled={isLoading} variant={isApprove ? 'success' : 'destructive'} onClick={onConfirm}>
          {isLoading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
          {confirmButtonText}
        </Button>
        <Button disabled={isLoading} variant="outline" onClick={onClose}>
          {t('dialogs.cancel')}
        </Button>
      </div>
    </Dialog>
  );
};
