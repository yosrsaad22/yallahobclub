'use client';

import * as React from 'react';
import { Input } from '@/components/ui/aceternity-input';
import { Label } from '@/components/ui/label';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { IconLoader2 } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import z from 'zod';
import { LabelInputContainer } from '@/components/ui/label-input-container';
import { ForgotPasswordSchema, LoginSchema } from '@/schemas';
import { FormError } from '@/components/ui/form-error';
import { forgotPassword } from '@/actions/auth';
import { FormSuccess } from '@/components/ui/form-success';
import { Link } from '@/navigation';
import { GradientButton } from '../ui/button';
import { ActionResponse } from '@/types';

interface ForgotPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ForgotPasswordForm({ className }: ForgotPasswordFormProps) {
  const [isLoading, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | undefined>('');
  const [success, setSuccess] = React.useState<string | undefined>('');
  const t = useTranslations('forgot-password');
  const tFields = useTranslations('fields');
  const tValidation = useTranslations('validation');

  type schemaType = z.infer<typeof ForgotPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<schemaType>({ resolver: zodResolver(ForgotPasswordSchema) });

  const onSubmit: SubmitHandler<schemaType> = (data, event) => {
    event?.preventDefault();
    setError('');
    setSuccess('');
    startTransition(() => {
      forgotPassword(data).then((res: ActionResponse) => {
        if (res.error) {
          setError(tValidation(res.error));
        } else {
          reset();
          setSuccess(tValidation(res.success));
        }
      });
    });
  };

  return (
    <div className={cn('mx-auto grid max-w-[25rem] gap-6 ', className)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">{tFields('user-email')}</Label>
          <Input
            {...register('email')}
            id="email"
            disabled={isLoading}
            placeholder="Email@email.com"
            type="email"
            className="bg-input"
          />
          {errors.email && <span className="text-xs text-red-400">{tValidation('email-error')}</span>}
        </LabelInputContainer>
        <FormError message={error} />
        <FormSuccess message={success} />
        <div className="mt-10 text-center">
          <GradientButton
            disabled={isLoading}
            type="submit"
            rounded="md"
            innerClassName="bg-background hover:bg-gray-800 active:bg-gray-800 "
            size={'full'}>
            {isLoading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
            {t('send-button')}
          </GradientButton>
          <div className="relative mt-4 flex flex-row justify-center text-sm">
            <Link href={'/login'} passHref>
              <span className="bg-background px-2 text-muted-foreground underline">{t('login-link')}</span>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
