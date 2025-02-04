'use client';
import { useEffect, useState } from 'react';
import { Button, LinkButton } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';
import { useCurrentRole } from '@/hooks/use-current-role';
import { cn } from '@/lib/utils';

interface PayWallCardProps {
  title: string;
  text: string;
  buttonText: string;
}

export const PayWallCard: React.FC<PayWallCardProps> = ({ title, text, buttonText }) => {
  const [isMounted, setIsMounted] = useState(false);
  const role = useCurrentRole();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed left-[50%] top-[45vh] z-50 grid max-h-[65%] w-[75%] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 focus:outline-none focus:ring-0 md:w-[35rem]',
      )}>
      <div className="flex flex-col space-y-1.5 text-center sm:text-left">
        <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>
        <p className="py-4 text-sm text-muted-foreground">{text}</p>
      </div>
      <div className="flex flex-row items-end justify-center space-x-4 space-y-2 md:justify-end">
        <LinkButton href={`/dashboard/${role?.toLowerCase()}/billing`} variant="primary">
          {buttonText}
        </LinkButton>
      </div>
    </div>
  );
};
