'use client';

import * as React from 'react';
import { Input } from '@/components/ui/aceternity-input';
import { Label } from '@/components/ui/label';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { IconCircleCheck, IconCircleCheckFilled, IconLoader2 } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import z from 'zod';
import { LabelInputContainer } from '../ui/label-input-container';
import { Link } from '@/navigation';
import { RegisterSchema } from '@/schemas';
import { FormError } from '@/components/ui/form-error';
import { FormSuccess } from '@/components/ui/form-success';
import { register as signup } from '@/actions/auth';
import { GradientButton } from '../ui/button';
import { states, packOptions } from '@/lib/constants';
import { ActionResponse } from '@/types';
import { Combobox } from '../ui/combobox';

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RegisterForm({ className }: RegisterFormProps) {
  const [isLoading, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | undefined>('');
  const [success, setSuccess] = React.useState<string | undefined>('');
  const [selectedPack, setSelectedPack] = React.useState('');
  const t = useTranslations('register');
  const tPricing = useTranslations('home.pricing');
  const tFields = useTranslations('fields');
  const tValidation = useTranslations('validation');
  const [state, setState] = React.useState<string>();

  type schemaType = z.infer<typeof RegisterSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<schemaType>({ resolver: zodResolver(RegisterSchema) });

  const onSubmit: SubmitHandler<schemaType> = async (data, event) => {
    event?.preventDefault();
    setError('');
    setSuccess('');
    startTransition(() => {
      signup(data).then((res: ActionResponse) => {
        if (res.error) {
          setError(tValidation(res.error));
        } else {
          reset();
          setSelectedPack('');
          setSuccess(tValidation(res.success));
        }
      });
    });
  };

  return (
    <div className="flex w-full flex-col">
      <form className="flex flex-col gap-0 md:gap-2">
        <div className="flex flex-col gap-0 md:flex-row md:gap-8 ">
          <div className="flex w-full flex-col items-center  lg:items-end">
            <LabelInputContainer className="mb-4 max-w-[25rem]">
              <Label htmlFor="name">{tFields('user-full-name')}</Label>
              <Input
                {...register('fullName')}
                id="fullName"
                disabled={isLoading}
                placeholder={tFields('user-full-name')}
                type="text"
                className="text-autofill bg-input text-foreground"
              />
              {errors.fullName && <span className="text-xs text-red-400">{tValidation('fullname-error')}</span>}
            </LabelInputContainer>
            <LabelInputContainer className="mb-4 max-w-[25rem]">
              <Label htmlFor="number">{tFields('user-number')}</Label>
              <Input
                {...register('number')}
                id="number"
                disabled={isLoading}
                placeholder={tFields('user-number')}
                type="text"
              />
              {errors.number && <span className="text-xs text-red-400">{tValidation('number-error')}</span>}
            </LabelInputContainer>
            <LabelInputContainer className="mb-4 max-w-[25rem]">
              <Label htmlFor="email">{tFields('user-email')}</Label>
              <Input
                {...register('email')}
                id="email"
                disabled={isLoading}
                placeholder="Email@email.com"
                type="email"
              />
              {errors.email && <span className="text-xs text-red-400">{tValidation('email-error')}</span>}
            </LabelInputContainer>
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
          </div>
          <div className="flex w-full flex-col items-center  lg:items-start">
            <LabelInputContainer className="mb-4 max-w-[25rem]">
              <Label htmlFor="state">{tFields('user-state')}</Label>
              <Combobox
                isDark
                items={states}
                selectedItems={state}
                onSelect={(selectedItem: string) => {
                  setState(selectedItem);
                  setValue('state', selectedItem);
                }}
                placeholder={tFields('user-state-placeholder')}
                displayValue={(item: string) => item}
                itemKey={(item: string) => states.indexOf(item).toString()}
                multiSelect={false}
              />
              {errors.state && <span className="text-xs text-red-400">{tValidation('user-state-error')}</span>}
            </LabelInputContainer>
            <LabelInputContainer className="mb-4 max-w-[25rem]">
              <Label htmlFor="city">{tFields('user-city')}</Label>
              <Input
                {...register('city')}
                id="age"
                disabled={isLoading}
                placeholder={tFields('user-city')}
                type="string"
              />
              {errors.city && <span className="text-xs text-red-400">{tValidation('city-error')}</span>}
            </LabelInputContainer>
            <LabelInputContainer className="mb-4 max-w-[25rem]">
              <Label htmlFor="address">{tFields('user-address')}</Label>
              <Input
                {...register('address')}
                id="age"
                disabled={isLoading}
                placeholder={tFields('user-address')}
                type="string"
              />
              {errors.address && <span className="text-xs text-red-400">{tValidation('address-error')}</span>}
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
          </div>
        </div>
      </form>
      <div className="relative mt-8 flex flex-row justify-center text-sm">
        <Link href={'/#pricing'} passHref>
          <span className="bg-background px-2 text-muted-foreground underline">{t('pricing-details')}</span>
        </Link>
      </div>
      <div className=" mt-10 flex min-w-full flex-col  gap-8 text-left lg:flex-row">
        <div
          onClick={() => {
            setValue('pack', packOptions.DAMREJ);
            setSelectedPack(packOptions.DAMREJ);
          }}
          className={cn(
            selectedPack === packOptions.DAMREJ ? 'border-primary shadow-sm shadow-primary' : '',
            'feature-glass-gradient flex w-full cursor-pointer flex-row items-center justify-between rounded-lg border-2 p-4',
          )}>
          <div className="flex flex-row items-center justify-center gap-4">
            {selectedPack === packOptions.DAMREJ && (
              <IconCircleCheckFilled className="flex h-6 w-6 text-primary"></IconCircleCheckFilled>
            )}
            {selectedPack !== packOptions.DAMREJ && (
              <IconCircleCheck className="flex h-6 w-6 text-primary"></IconCircleCheck>
            )}
            <div className="flex flex-col items-start justify-center">
              <h1 className="text-gradient text-md text-md font-bold  ">PACK DAMREJ</h1>
              <p className="text-sm font-medium italic text-gray-400">{tPricing('free')}</p>
            </div>
          </div>
          <h2 className="text-gradient ml-2 flex text-xl font-semibold">0 DT</h2>
        </div>
        <div
          onClick={() => {
            setSelectedPack(packOptions.AJEJA);
            setValue('pack', packOptions.AJEJA);
          }}
          className={cn(
            selectedPack === packOptions.AJEJA ? 'border-primary shadow-sm shadow-primary' : '',
            'feature-glass-gradient flex w-full cursor-pointer flex-row items-center justify-between rounded-lg border-2 p-4',
          )}>
          <div className="flex flex-row items-center justify-center gap-4">
            {selectedPack === packOptions.AJEJA && (
              <IconCircleCheckFilled className="flex h-6 w-6 text-primary"></IconCircleCheckFilled>
            )}
            {selectedPack !== packOptions.AJEJA && (
              <IconCircleCheck className="flex h-6 w-6 text-primary"></IconCircleCheck>
            )}
            <div className="flex flex-col items-start justify-center">
              <h1 className="text-gradient text-md font-bold">PACK 3JEJA</h1>
              <p className="text-sm font-medium italic text-gray-400">{tPricing('pay-once')}</p>
            </div>
          </div>
          <h2 className="text-gradient  ml-2 flex text-xl font-semibold">750 DT</h2>
        </div>
        <div
          onClick={() => {
            setValue('pack', packOptions.MACHROU3);
            setSelectedPack(packOptions.MACHROU3);
          }}
          className={cn(
            selectedPack === packOptions.MACHROU3 ? 'border-primary shadow-sm shadow-primary' : '',
            'feature-glass-gradient flex w-full cursor-pointer flex-row items-center justify-between rounded-lg border-2 p-4',
          )}>
          <div className="flex flex-row items-center justify-center gap-4 ">
            {selectedPack === packOptions.MACHROU3 && (
              <IconCircleCheckFilled className="flex h-6 w-6 text-primary"></IconCircleCheckFilled>
            )}
            {selectedPack !== packOptions.MACHROU3 && (
              <IconCircleCheck className="flex h-6 w-6 text-primary"></IconCircleCheck>
            )}
            <div className="flex flex-col items-start justify-center">
              <h1 className="text-gradient text-md font-bold">PACK MACHROU3</h1>
              <p className="text-sm font-medium italic text-gray-400">{tPricing('pay-once')}</p>
            </div>
          </div>
          <h2 className="text-gradient  ml-4 flex text-xl font-semibold">1500 DT</h2>
        </div>
      </div>
      <div className="flex flex-row justify-center pt-2">
        {errors.pack && <span className="text-xs text-red-400">{tValidation('pack-error')}</span>}
      </div>
      <div className="mx-auto w-full max-w-[25rem]">
        <FormError message={error} />
        <FormSuccess message={success} />
        <div className="mt-10 text-center">
          <GradientButton
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
            rounded="md"
            innerClassName="bg-background hover:bg-gray-800 active:bg-gray-800 "
            size={'full'}>
            {isLoading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}

            {t('register-button')}
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
