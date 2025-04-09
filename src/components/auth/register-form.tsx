'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconLoader2 } from '@tabler/icons-react';
import z from 'zod';
import { LabelInputContainer } from '../ui/label-input-container';
import { RegisterSchema } from '@/schemas';
import { FormError } from '@/components/ui/form-error';
import { FormSuccess } from '@/components/ui/form-success';
import { register as signup } from '@/actions/auth';
import { Button } from '../ui/button';
import { ActionResponse } from '@/types';
import { roleOptions } from '@/lib/constants';
import { IconBrandGoogle } from '@tabler/icons-react';
import { signIn } from 'next-auth/react'; // Import signIn from next-auth

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RegisterForm({ className }: RegisterFormProps) {
  const [isLoading, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | undefined>('');
  const [success, setSuccess] = React.useState<string | undefined>('');

  type schemaType = z.infer<typeof RegisterSchema>;

  let defaultValues = {
    role: roleOptions.USER,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<schemaType>({ resolver: zodResolver(RegisterSchema), defaultValues });

  const onSubmit: SubmitHandler<schemaType> = async (data, event) => {
    event?.preventDefault();
    setError('');
    setSuccess('');
    startTransition(() => {
      signup(data).then((res: ActionResponse) => {
        if (res.error) {
          setError(res.error);
        } else {
          reset();
          setSuccess(res.success);
        }
      });
    });
  };

  const handleGoogleLogin = () => {
    // Trigger Google login using NextAuth's signIn method
    signIn('google');
  };

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <form className="flex w-full flex-col gap-0 md:gap-2">
        <div className="flex flex-col gap-0 md:flex-row md:gap-8">
          <div className="flex w-full flex-col items-center md:w-1/2">
            <LabelInputContainer className="mb-4 max-w-[25rem]">
              <Label htmlFor="fullName">Nom Complet</Label>
              <Input
                {...register('fullName')}
                id="fullName"
                disabled={isLoading}
                placeholder="Nom Complet"
                type="text"
              />
              {errors.fullName && <span className="text-xs text-red-400">Le nom complet est requis</span>}
            </LabelInputContainer>

            <LabelInputContainer className="mb-4 max-w-[25rem]">
              <Label htmlFor="number">Numéro de Téléphone</Label>
              <Input
                {...register('number')}
                id="number"
                disabled={isLoading}
                placeholder="Numéro de Téléphone"
                type="text"
              />
              {errors.number && <span className="text-xs text-red-400">Le numéro de téléphone est requis</span>}
            </LabelInputContainer>

            <LabelInputContainer className="mb-4 max-w-[25rem]">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register('email')}
                id="email"
                disabled={isLoading}
                placeholder="Email@email.com"
                type="email"
              />
              {errors.email && <span className="text-xs text-red-400">L'email est invalide</span>}
            </LabelInputContainer>
          </div>

          <div className="flex w-full flex-col items-center md:w-1/2">
            <LabelInputContainer className="mb-4 max-w-[25rem]">
              <Label htmlFor="address">Adresse</Label>
              <Input {...register('address')} id="address" disabled={isLoading} placeholder="Adresse" type="text" />
              {errors.address && <span className="text-xs text-red-400">L'adresse est requise</span>}
            </LabelInputContainer>

            <LabelInputContainer className="mb-4 max-w-[25rem]">
              <Label htmlFor="password">Mot de Passe</Label>
              <Input
                {...register('password')}
                id="password"
                disabled={isLoading}
                placeholder="Mot de Passe"
                type="password"
              />
              {errors.password && <span className="text-xs text-red-400">Le mot de passe est requis</span>}
            </LabelInputContainer>

            <LabelInputContainer className="mb-4 max-w-[25rem]">
              <Label htmlFor="confirmPassword">Confirmer le Mot de Passe</Label>
              <Input
                {...register('confirmPassword')}
                id="confirmPassword"
                disabled={isLoading}
                placeholder="Confirmer le Mot de Passe"
                type="password"
              />
              {errors.confirmPassword && (
                <span className="text-xs text-red-400">Les mots de passe ne correspondent pas</span>
              )}
            </LabelInputContainer>
          </div>
        </div>
      </form>

      <div className="mx-auto w-full max-w-[25rem]">
        <FormError message={error} />
        <FormSuccess message={success} />
        <div className="mt-10 text-center">
          <Button
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
            className="w-full bg-red-500 text-white hover:bg-red-600 active:bg-red-600"
          >
            {isLoading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
            S'inscrire
          </Button>

          {/* Google Login Button */}
          <Button
            onClick={handleGoogleLogin}
            type="button"
            className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
          >
            <IconBrandGoogle className="h-5 w-5" />
            Se connecter avec Google
          </Button>
        </div>
      </div>
    </div>
  );
}
