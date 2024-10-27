'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';
import { IconLoader2 } from '@tabler/icons-react';

interface RequestPickupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  orderNumber: string;
}

export const RequestPickupDialog: React.FC<RequestPickupDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  orderNumber,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations('dashboard');
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog
      title={t('dialogs.pickup-title')}
      description={t('dialogs.pickup-text', { subject: orderNumber })}
      isOpen={isOpen}
      onClose={onClose}>
      <div className="flex w-full items-center justify-center space-x-2 md:justify-end">
        <Button disabled={isLoading} variant="primary" onClick={onConfirm}>
          {isLoading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
          {t('dialogs.confirm')}
        </Button>
        <Button disabled={isLoading} variant="outline" onClick={onClose}>
          {t('dialogs.cancel')}
        </Button>
      </div>
    </Dialog>
  );
};
