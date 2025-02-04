'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/navigation';
import { IconLoader2, IconMail, IconPhone, IconRefresh } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import React from 'react';

const AwaitingDocumentApprovalCard: React.FC = () => {
  const t = useTranslations('dashboard.text');
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  return (
    <div className=" mx-auto rounded-md  border border-border bg-background p-4 shadow-xl md:w-[45%]">
      <div className="flex flex-col gap-4 p-6">
        <h2 className="mx-auto  max-w-xl text-center text-2xl font-semibold text-foreground">
          {t('on-boarding-2-title')}
        </h2>
        <p className="text-center text-sm text-muted-foreground">{t('on-boarding-2-description')}</p>
      </div>
      <div className="flex w-full items-center justify-center">
        <Button
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => {
              router.refresh();
              setIsLoading(false);
            }, 2000);
          }}
          className="flex items-center gap-x-2"
          size={'default'}>
          {isLoading ? <IconLoader2 className="animate-spin" /> : <IconRefresh />}
          {t('try-again')}
        </Button>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-y-2 pb-3 pt-6">
        <p className="flex flex-row items-center gap-x-2 text-sm font-normal text-muted-foreground">
          <IconMail className="h-5 w-5" /> support@ecomness.com
        </p>
        <p className="flex flex-row items-center gap-x-2 text-sm font-normal text-muted-foreground">
          <IconPhone className="h-5 w-5" /> (+216) 24 002 024
        </p>
      </div>
    </div>
  );
};

export default AwaitingDocumentApprovalCard;
