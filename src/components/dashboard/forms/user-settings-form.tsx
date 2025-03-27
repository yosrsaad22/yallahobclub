'use client';

import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { IconDeviceFloppy, IconLoader2, IconUser } from '@tabler/icons-react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { toast } from '@/components/ui/use-toast';
import { LabelInputContainer } from '@/components/ui/label-input-container';
import { MEDIA_HOSTNAME } from '@/lib/constants';
import { useSession } from 'next-auth/react';
import { ActionResponse } from '@/types';
import { UserSettingsSchema } from '@/schemas';
import { userEditSettings } from '@/actions/settings';
import { UploadButton } from '@/lib/uploadthing';

interface UserSettingsFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserSettingsForm({ className }: UserSettingsFormProps) {
  const [isLoading, startTransition] = React.useTransition();
  const user = useCurrentUser();
  const session = useSession();

  type schemaType = z.infer<typeof UserSettingsSchema>;

  const defaultValues = {
    fullName: user?.fullName || '',
    email: user?.email || '',
    number: user?.number || '',
    address: user?.address || '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<schemaType>({
    resolver: zodResolver(UserSettingsSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<schemaType> = async (data, event) => {
    event?.preventDefault();
    if (Object.keys(errors).length > 0) {
      return;
    }

    startTransition(() => {
      userEditSettings(data).then((res: ActionResponse) => {
        if (res.success) {
          toast({
            variant: 'success',
            title: 'Succès',
            description: 'Paramètres mis à jour avec succès',
          });
          session.update();
        } else {
          toast({
            variant: 'destructive',
            title: 'Erreur',
            description: res.error,
          });
        }
      });
    });
  };

  return (
    <div className="flex h-full w-full flex-col items-center gap-8">
      <form className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full rounded-lg p-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32">
              <AvatarImage className="object-cover" src={`${MEDIA_HOSTNAME}${user?.image}`} alt={user?.name ?? ''} />
              <AvatarFallback className="text-4xl">
                <IconUser className="h-14 w-14" />
              </AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <UploadButton
              className="ut-button:bg-foreground ut-button:text-background"
              endpoint="userImage"
              onClientUploadComplete={(res) => {
                session.update();
                toast({
                  variant: 'success',
                  title: 'Succès',
                  description: 'Photo de profil mise à jour avec succès',
                });
              }}
              onUploadError={(error: Error) => {
                toast({
                  variant: 'destructive',
                  title: 'Erreur',
                  description: "Échec du téléchargement de l'image",
                });
              }}
            />
          </div>
        </div>

        <div className="w-full rounded-lg border bg-background p-6">
          <div className="space-y-2">
            <h2 className="pb-4 text-lg font-semibold">Informations Utilisateur</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <LabelInputContainer>
                <Label htmlFor="fullName">Nom Complet</Label>
                <Input {...register('fullName')} id="fullName" disabled={isLoading} type="text" />
                {errors.fullName && <span className="text-xs text-red-400">{errors.fullName.message}</span>}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="email">Email</Label>
                <Input {...register('email')} disabled={isLoading} id="email" type="email" />
                {errors.email && <span className="text-xs text-red-400">{errors.email.message}</span>}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="number">Numéro de Téléphone</Label>
                <Input {...register('number')} disabled={isLoading} id="number" type="tel" />
                {errors.number && <span className="text-xs text-red-400">{errors.number.message}</span>}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="address">Adresse</Label>
                <Input {...register('address')} disabled={isLoading} id="address" type="text" />
                {errors.address && <span className="text-xs text-red-400">{errors.address.message}</span>}
              </LabelInputContainer>
            </div>
          </div>
        </div>

        <div className="w-full space-y-6 rounded-lg border bg-background p-6">
          <div className="space-y-2">
            <h2 className="pb-4 text-lg font-semibold">Changer le Mot de Passe</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <LabelInputContainer>
                <Label htmlFor="currentPassword">Mot de Passe Actuel</Label>
                <Input {...register('currentPassword')} disabled={isLoading} id="currentPassword" type="password" />
                {errors.currentPassword && (
                  <span className="text-xs text-red-400">{errors.currentPassword.message}</span>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="newPassword">Nouveau Mot de Passe</Label>
                <Input {...register('newPassword')} disabled={isLoading} id="newPassword" type="password" />
                {errors.newPassword && <span className="text-xs text-red-400">{errors.newPassword.message}</span>}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="confirmPassword">Confirmer le Mot de Passe</Label>
                <Input {...register('confirmPassword')} disabled={isLoading} id="confirmPassword" type="password" />
                {errors.confirmPassword && (
                  <span className="text-xs text-red-400">{errors.confirmPassword.message}</span>
                )}
              </LabelInputContainer>
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[25rem] justify-center pb-8 pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
            {!isLoading && <IconDeviceFloppy className="mr-2 h-5 w-5" />}
            Enregistrer les Modifications
          </Button>
        </div>
      </form>
    </div>
  );
}
