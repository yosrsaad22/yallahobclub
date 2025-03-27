'use client';

import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { UserSchema } from '@/schemas';
import { AvatarFallback, Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { IconDeviceFloppy, IconLoader2, IconUserPlus } from '@tabler/icons-react';
import { toast } from '@/components/ui/use-toast';
import { LabelInputContainer } from '@/components/ui/label-input-container';
import { roleOptions } from '@/lib/constants';
import { ActionResponse } from '@/types';
import { addUser } from '@/actions/users';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddUserFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AddUserForm({ className }: AddUserFormProps) {
  const [isLoading, startTransition] = React.useTransition();
  const router = useRouter();
  type schemaType = z.infer<typeof UserSchema>;

  const defaultValues = {
    onBoarding: 0,
    role: roleOptions.USER,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<schemaType>({ resolver: zodResolver(UserSchema), defaultValues });

  const onSubmit: SubmitHandler<schemaType> = async (data, event) => {
    event?.preventDefault();
    startTransition(() => {
      addUser(data).then((res: ActionResponse) => {
        if (res.success) {
          toast({
            variant: 'success',
            title: 'Succès',
            description: res.success,
          });
          router.push('/dashboard/admin/users');
          router.refresh();
        } else {
          toast({
            variant: 'destructive',
            title: 'Erreur',
            description: res.error || 'Une erreur est survenue',
          });
        }
      });
    });
  };

  return (
    <div className="flex h-full w-full flex-col items-center pt-2">
      <form className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full rounded-lg border bg-background p-6">
          <div className="space-y-2">
            <div className="w-full rounded-lg p-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32">
                  <AvatarFallback>
                    <IconUserPlus className="h-12 w-12"></IconUserPlus>
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <h2 className="pb-4 text-lg font-semibold">Informations de l'utilisateur</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <LabelInputContainer>
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  {...register('fullName')}
                  id="fullName"
                  disabled={isLoading}
                  placeholder="Nom complet"
                  type="text"
                />
                {errors.fullName && <span className="text-xs text-red-400">Le nom complet est requis</span>}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="email">Email</Label>
                <Input {...register('email')} disabled={isLoading} id="email" placeholder="Email" type="email" />
                {errors.email && <span className="text-xs text-red-400">Email invalide</span>}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="number">Numéro de téléphone</Label>
                <Input {...register('number')} disabled={isLoading} id="number" placeholder="12345678" type="text" />
                {errors.number && (
                  <span className="text-xs text-red-400">Numéro de téléphone invalide (8 chiffres)</span>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="address">Adresse</Label>
                <Input {...register('address')} disabled={isLoading} id="address" placeholder="Adresse" type="text" />
                {errors.address && <span className="text-xs text-red-400">L'adresse est requise</span>}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="role">Rôle</Label>
                <Select
                  defaultValue={roleOptions.USER}
                  onValueChange={(value) => setValue('role', value as roleOptions)}
                  disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={roleOptions.ADMIN}>Administrateur</SelectItem>
                    <SelectItem value={roleOptions.USER}>Utilisateur</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <span className="text-xs text-red-400">Le rôle est requis</span>}
              </LabelInputContainer>
            </div>
          </div>
          <div className="mx-auto flex w-full max-w-[25rem] justify-center pb-8 pt-16">
            <Button type="submit" className="h-12" size="default" disabled={isLoading}>
              {isLoading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
              {!isLoading && <IconDeviceFloppy className="mr-2 h-5 w-5 " />}
              Enregistrer
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
