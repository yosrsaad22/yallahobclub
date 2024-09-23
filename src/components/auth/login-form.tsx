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
import { LoginSchema } from '@/schemas';
import { FormError } from '@/components/ui/form-error';
import { login } from '@/actions/auth';
import { Link, useRouter } from '@/navigation';
import { GradientButton } from '../ui/button';
import { ActionResponse } from '@/types';

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ className }: LoginFormProps) {
  const [isLoading, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | undefined>('');
  const t = useTranslations('login');
  const tFields = useTranslations('fields');
  const tValidation = useTranslations('validation');
  const router = useRouter();

  type schemaType = z.infer<typeof LoginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<schemaType>({ resolver: zodResolver(LoginSchema) });

  const onSubmit: SubmitHandler<schemaType> = (data, event) => {
    event?.preventDefault();
    setError('');
    startTransition(() => {
      login(data).then((res: ActionResponse) => {
        if (res.error) {
          setError(tValidation(res.error));
        } else {
          router.push(`/dashboard/${res.data}`);
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
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password" className="flex items-end justify-between">
            {tFields('user-password')}

            <Link href={'/forgot-password'} passHref>
              <span className="text-sm text-muted-foreground underline">{t('forgot-password')}</span>
            </Link>
          </Label>
          <Input
            {...register('password')}
            id="password"
            disabled={isLoading}
            placeholder={tFields('user-password')}
            type="password"
            className="dark bg-input text-foreground"
          />
          {errors.password && <span className="text-xs text-red-400">{tValidation('password-error')}</span>}
        </LabelInputContainer>
        <FormError message={error} />
        <div className="mt-10 text-center">
          <GradientButton
            disabled={isLoading}
            type="submit"
            rounded="md"
            innerClassName="bg-background hover:bg-gray-800 active:bg-gray-800 "
            size={'full'}>
            {isLoading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}

            {t('login-button')}
          </GradientButton>
          <div className="relative mt-4 flex flex-row justify-center text-sm">
            <Link href={'/register'} passHref>
              <span className="bg-background px-2 text-muted-foreground underline">{t('register-link')}</span>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
