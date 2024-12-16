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
import { ResetPasswordSchema } from '@/schemas';
import { FormError } from '@/components/ui/form-error';
import { Link, useRouter } from '@/navigation';
import { FormSuccess } from '@/components/ui/form-success';
import { useSearchParams } from 'next/navigation';
import { ResetPassword } from '@/actions/auth';
import { GradientButton } from '../ui/button';
import { ActionResponse } from '@/types';

interface ResetPasswordFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ResetPasswordForm({ className }: ResetPasswordFormProps) {
  const [isLoading, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | undefined>('');
  const [success, setSuccess] = React.useState<string | undefined>('');
  const t = useTranslations('reset-password');
  const tFields = useTranslations('fields');
  const tValidation = useTranslations('validation');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  type schemaType = z.infer<typeof ResetPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<schemaType>({ resolver: zodResolver(ResetPasswordSchema) });

  const onSubmit: SubmitHandler<schemaType> = (data, event) => {
    event?.preventDefault();
    setSuccess('');
    setError('');

    startTransition(() => {
      if (token === null) {
        setError(tValidation('password-reset-token-unexistant-error'));
      } else {
        ResetPassword(data, token).then((res: ActionResponse) => {
          if (res.error) {
            setError(tValidation(res.error));
          } else {
            reset();
            setSuccess(tValidation(res.success));
            setTimeout(() => {
              router.push('/login');
            }, 4000);
          }
        });
      }
    });
  };

  return (
    <div className={cn('mx-auto grid max-w-[25rem] gap-6 ', className)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <LabelInputContainer className="mb-4 max-w-[25rem]">
          <Label htmlFor="password">{tFields('user-password')}</Label>
          <Input
            {...register('password')}
            id="password"
            disabled={isLoading}
            placeholder={tFields('user-password')}
            type="password"
          />
          {errors.password && <span className="text-xs text-red-400">{tValidation('password-error')}</span>}
        </LabelInputContainer>
        <LabelInputContainer className="mb-4 max-w-[25rem]">
          <Label htmlFor="confirmPassword">{tFields('user-confirm-password')}</Label>
          <Input
            {...register('confirmPassword')}
            id="confirmPassword"
            disabled={isLoading}
            placeholder={tFields('user-confirm-password')}
            type="password"
          />
          {errors.confirmPassword && (
            <span className="text-xs text-red-400">{tValidation('confirm-password-error')}</span>
          )}
        </LabelInputContainer>
        <FormSuccess message={success} />
        <FormError message={error} />
        <div className="mt-10 text-center">
          <GradientButton
            disabled={isLoading}
            type="submit"
            rounded="md"
            innerClassName="bg-[#101619] hover:bg-gray-800 active:bg-gray-800 "
            size={'full'}>
            {isLoading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
            {t('reset-button')}
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
