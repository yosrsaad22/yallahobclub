'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { PuffLoader } from 'react-spinners';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { EmailVerification } from '@/actions/auth';
import { FormError } from '@/components/ui/form-error';
import { FormSuccess } from '@/components/ui/form-success';
import { GradientLinkButton } from '../ui/button';
import { ActionResponse } from '@/types';

interface EmailVerificationFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LogiEmailVerificationForm({ className }: EmailVerificationFormProps) {
  const [error, setError] = React.useState<string | undefined>('');
  const [success, setSuccess] = React.useState<string | undefined>('');
  const t = useTranslations('email-verification');
  const tValidation = useTranslations('validation');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const onSubmit = React.useCallback(() => {
    setError('');
    setSuccess('');
    if (token === null) {
      setError(tValidation('email-verification-token-unexistant-error'));
    } else {
      EmailVerification(token)
        .then((res: ActionResponse) => {
          if (res.error) {
            setError(tValidation(res.error));
          } else {
            setSuccess(tValidation(res.success));
          }
        })
        .catch(() => {
          setError(tValidation('unknown-error'));
        });
    }
  }, [token, tValidation]);

  React.useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className={cn('mx-auto grid max-w-[25rem] gap-6 ', className)}>
      {!success && !error && <PuffLoader className="mx-auto mb-6 mt-4" size={100} loading color="white" />}
      <FormError message={error} />
      <FormSuccess message={success} />
      <GradientLinkButton
        innerClassName={'bg-background hover:bg-gray-800 active:bg-gray-800'}
        rounded={'md'}
        size={'full'}
        href={'/login'}>
        {t('login-button')}
      </GradientLinkButton>
    </div>
  );
}
