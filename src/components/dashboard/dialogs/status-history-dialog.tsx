'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';
import { IconLoader2, IconRefresh } from '@tabler/icons-react';
import { StatusHistory } from '@prisma/client';
import { useRouter } from '@/navigation';
import { formatDate } from '@/lib/utils';

interface StatusHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  deliveryId: string;
  statusHistory: StatusHistory[];
}

export const StatusHistoryDialog: React.FC<StatusHistoryDialogProps> = ({
  isOpen,
  onClose,
  deliveryId,
  statusHistory,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, startLoading] = useState(false);
  const t = useTranslations('dashboard');
  const tStatusKey = useTranslations('dashboard.order-statuses');
  const tStatusDescription = useTranslations('dashboard.order-statuses-descriptions');

  const router = useRouter();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog
      title={t('dialogs.status-history-title')}
      description={t('dialogs.status-history-text', { subject: deliveryId })}
      isOpen={isOpen}
      onClose={onClose}>
      <div className="custom-scrollbar relative mt-[-10px] flex max-h-[320px] flex-col items-center justify-start gap-10 overflow-y-auto rounded-md border border-border p-3">
        {statusHistory
          .slice()
          .reverse()
          .map((history: StatusHistory, index) => (
            <div
              key={index}
              className="relative flex w-full flex-col items-start justify-start gap-3 rounded-md border border-border p-3">
              {index !== statusHistory.length - 1 && (
                <div className="absolute left-1/2 top-full h-10 w-px -translate-x-1/2 transform bg-border">
                  <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border">
                    <div className="absolute  h-3 w-3  transform animate-pulse rounded-full bg-primary"></div>
                  </div>
                </div>
              )}
              <div className="flex w-full flex-col items-start justify-between md:flex-row md:items-center">
                <p className="text-sm font-semibold ">{tStatusKey(history.status)}</p>
                <p className=" text-xs text-muted-foreground">{formatDate(history.createdAt)}</p>
              </div>
              <p className="flex flex-wrap text-sm font-normal">{tStatusDescription(history.statusDescription)}</p>
            </div>
          ))}
      </div>

      <div className="mt-4 flex w-full items-center justify-center space-x-2 md:justify-end">
        <Button
          disabled={isLoading}
          variant="primary"
          onClick={() => {
            startLoading(true);
            router.refresh();
            setTimeout(() => {
              startLoading(false);
            }, 2000);
          }}>
          {isLoading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
          {!isLoading && <IconRefresh className="mr-2 h-5 w-5" />}
          {t('dialogs.refresh')}
        </Button>
        <Button disabled={isLoading} variant="outline" onClick={onClose}>
          {t('dialogs.close')}
        </Button>
      </div>
    </Dialog>
  );
};
