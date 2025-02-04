'use client';

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { IconAlertCircle, IconCircleCheck, IconInfoCircle } from '@tabler/icons-react';

export function Toaster() {
  const { toasts } = useToast();

  const getIconForVariant = (variant: string) => {
    switch (variant) {
      case 'success':
        return <IconCircleCheck className="h-10 w-10 text-white" />;
      case 'destructive':
        return <IconAlertCircle className="h-10 w-10 text-white" />;
      case 'primary':
        return <IconInfoCircle className="h-10 w-10 text-white" />;
      default:
        return <IconInfoCircle className="h-10 w-10 text-primary" />;
    }
  };
  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, variant, ...props }) => (
        <Toast key={id} variant={variant} {...props}>
          <div className="flex items-center justify-between gap-3">
            <div className="">{getIconForVariant(variant ?? 'default')}</div>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
