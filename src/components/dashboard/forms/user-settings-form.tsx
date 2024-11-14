'use client';

import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import z from 'zod';
import { UserSettingsSchema } from '@/schemas';
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { IconCircleCheck, IconCircleCheckFilled, IconDeviceFloppy, IconLoader2, IconUser } from '@tabler/icons-react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { userEditSettings } from '@/actions/settings';
import { toast } from '@/components/ui/use-toast';
import { LabelInputContainer } from '@/components/ui/label-input-container';
import { UploadButton } from '@/lib/uploadthing';
import { cities, MEDIA_HOSTNAME, packOptions, roleOptions } from '@/lib/constants';
import { useSession } from 'next-auth/react';
import { ActionResponse } from '@/types';
import { cn } from '@/lib/utils';
import { Combobox } from '@/components/ui/combobox';

interface UserSettingsFormProps extends React.HTMLAttributes<HTMLDivElement> {}
export function UserSettingsForm({ className }: UserSettingsFormProps) {
  const [isLoading, startTransition] = React.useTransition();
  const t = useTranslations('dashboard.text');
  const tFields = useTranslations('fields');
  const tValidation = useTranslations('validation');
  const user = useCurrentUser();
  const session = useSession();

  type schemaType = z.infer<typeof UserSettingsSchema>;

  const [selectedPack, setSelectedPack] = React.useState(user?.pack as packOptions);
  const [city, setCity] = React.useState<string>(user?.city ?? '');
  const tPricing = useTranslations('home.pricing');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<schemaType>({ resolver: zodResolver(UserSettingsSchema) });

  if (user) {
    setValue('pack', user.pack);
  }

  const onSubmit: SubmitHandler<schemaType> = async (data, event) => {
    event?.preventDefault();
    startTransition(() => {
      userEditSettings(data).then((res: ActionResponse) => {
        if (res.success) {
          toast({
            variant: 'success',
            title: tValidation('success-title'),
            description: tValidation(res.success),
          });
          session.update();
        } else {
          toast({
            variant: 'destructive',
            title: tValidation('error-title'),
            description: tValidation(res.error),
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
              className={`flex flex-col items-center justify-center gap-1 text-sm ut-button:rounded-md ut-button:border-none ut-button:bg-foreground ut-button:text-sm ut-button:font-semibold ut-button:text-background ut-button:ring-offset-background ut-button:focus-within:bg-foreground ut-button:hover:bg-foreground/80 ut-button:focus:bg-foreground ut-button:focus-visible:outline-none ut-button:focus-visible:ring-2 ut-button:focus-visible:ring-ring ut-button:focus-visible:ring-offset-2 ut-button:active:bg-foreground ut-uploading:pointer-events-none ${className}`}
              appearance={{
                button:
                  'focus-within:ring-foreground ut-ready:bg-foreground ut-uploading:cursor-not-allowed after:bg-foreground',
                allowedContent: 'text-secondary',
              }}
              content={{
                button({ ready, isUploading }) {
                  if (isUploading) return <IconLoader2 className="z-[5] h-5 w-5 animate-spin" />;
                  if (!ready) return <IconLoader2 className="z-[5] h-5 w-5 animate-spin" />;

                  return <div>{t('image-button')}</div>;
                },
              }}
              endpoint="userImage"
              onClientUploadComplete={(res) => {
                session.update();
                toast({
                  variant: 'success',
                  title: tValidation('success-title'),
                  description: tValidation('image-upload-success'),
                });
              }}
              onUploadError={(error: Error) => {
                toast({
                  variant: 'destructive',
                  title: tValidation('error-title'),
                  description: tValidation('image-upload-error'),
                });
              }}
            />
          </div>
        </div>
        <div className="w-full rounded-lg border bg-background p-6">
          <div className="space-y-2">
            <h2 className="pb-4 text-lg font-semibold">{t('user-information')}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <LabelInputContainer>
                <Label htmlFor="name">{tFields('user-full-name')}</Label>
                <Input
                  {...register('fullName')}
                  id="fullName"
                  disabled={isLoading}
                  defaultValue={user?.name ?? ''}
                  placeholder={tFields('user-full-name')}
                  type="text"
                />
                {errors.fullName && <span className="text-xs text-red-400">{tValidation('fullname-error')}</span>}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="email">
                  {tFields('user-email')}
                  <span className="ml-2 text-xs text-gray-400">{t('email-note')}</span>
                </Label>
                <Input
                  {...register('email')}
                  disabled={isLoading}
                  defaultValue={user?.email ?? ''}
                  id="email"
                  placeholder={tFields('user-email')}
                  type="email"
                />
                {errors.email && <span className="text-xs text-red-400">{tValidation('email-error')}</span>}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="number">{tFields('user-number')}</Label>
                <Input
                  {...register('number')}
                  disabled={isLoading}
                  defaultValue={user?.number ?? ''}
                  id="number"
                  placeholder={tFields('user-number')}
                  type="tel"
                />
                {errors.number && <span className="text-xs text-red-400">{tValidation('number-error')}</span>}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="address">{tFields('user-address')}</Label>
                <Input
                  {...register('address')}
                  defaultValue={user?.address ?? ''}
                  disabled={isLoading}
                  id="address"
                  placeholder={tFields('user-address')}
                  type="text"
                />
                {errors.address && <span className="text-xs text-red-400">{tValidation('address-error')}</span>}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="city">{tFields('user-city')}</Label>
                <Combobox
                  items={cities}
                  selectedItems={city}
                  onSelect={(selectedItem: string) => {
                    setCity(selectedItem);
                    setValue('city', selectedItem);
                  }}
                  placeholder={tFields('user-city-placeholder')}
                  displayValue={(item: string) => item}
                  itemKey={(item: string) => cities.indexOf(item).toString()}
                  multiSelect={false}
                />
                {errors.city && <span className="text-xs text-red-400">{tValidation('user-city-error')}</span>}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="rib">{tFields('user-rib')}</Label>
                <Input
                  {...register('rib')}
                  disabled={isLoading}
                  id="rib"
                  defaultValue={user?.rib ?? ''}
                  placeholder={tFields('user-rib')}
                  type="tel"
                />
                {errors.rib && <span className="text-xs text-red-400">{tValidation('rib-error')}</span>}
              </LabelInputContainer>
            </div>
          </div>
        </div>

        <div className="w-full space-y-6 rounded-lg border bg-background p-6">
          <div className="space-y-2">
            <h2 className="pb-4 text-lg font-semibold">{t('change-password')}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <LabelInputContainer>
                <Label htmlFor="currentPassword">{tFields('user-current-password')}</Label>
                <Input
                  disabled={isLoading}
                  id="currentPassword"
                  {...register('currentPassword')}
                  placeholder={tFields('user-current-password')}
                  type="password"
                />
                {errors.currentPassword && (
                  <span className="text-xs text-red-400">{tValidation('password-error')}</span>
                )}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="newPassword">{tFields('user-new-password')}</Label>
                <Input
                  disabled={isLoading}
                  id="newPassword"
                  {...register('newPassword')}
                  placeholder={tFields('user-new-password')}
                  type="password"
                />
                {errors.newPassword && <span className="text-xs text-red-400">{tValidation('password-error')}</span>}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="confirmPassword">{tFields('user-confirm-password')}</Label>
                <Input
                  disabled={isLoading}
                  id="confirmPassword"
                  {...register('confirmPassword')}
                  placeholder={tFields('user-confirm-password')}
                  type="password"
                />
                {errors.confirmPassword && (
                  <span className="text-xs text-red-400">{tValidation('confirm-password-error')}</span>
                )}
              </LabelInputContainer>
            </div>
          </div>
        </div>
        {user?.role === roleOptions.SELLER && (
          <div className="w-full space-y-6 rounded-lg border  bg-background p-6">
            <div className="space-y-2">
              <h2 className="pb-4 text-lg font-semibold">{t('pack-information')}</h2>
              <div className=" mt-10 flex min-w-full flex-col  gap-8 text-left lg:flex-row">
                <div
                  onClick={() => {
                    setValue('pack', packOptions.DAMREJ);
                    setSelectedPack(packOptions.DAMREJ);
                  }}
                  className={cn(
                    selectedPack === packOptions.DAMREJ ? 'border-2 border-primary' : 'border border-input ',
                    'flex w-full cursor-pointer flex-row items-center justify-between rounded-lg p-4',
                  )}>
                  <div className="flex flex-row items-center justify-center gap-4">
                    {selectedPack === packOptions.DAMREJ && (
                      <IconCircleCheckFilled className="flex h-6 w-6 text-primary"></IconCircleCheckFilled>
                    )}
                    {selectedPack !== packOptions.DAMREJ && (
                      <IconCircleCheck className="flex h-6 w-6 text-primary"></IconCircleCheck>
                    )}
                    <div className="flex flex-col items-start justify-center">
                      <h1 className="text-md text-md font-bold text-foreground  ">PACK DAMREJ</h1>
                      <p className="text-sm font-medium italic text-foreground">{tPricing('free')}</p>
                    </div>
                  </div>
                  <h2 className="ml-2 flex text-xl font-semibold text-foreground">0 DT</h2>
                </div>
                <div
                  onClick={() => {
                    setSelectedPack(packOptions.AJEJA);
                    setValue('pack', packOptions.AJEJA);
                  }}
                  className={cn(
                    selectedPack === packOptions.AJEJA ? 'border-2 border-primary' : 'border border-input ',
                    'flex w-full cursor-pointer flex-row items-center justify-between rounded-lg p-4',
                  )}>
                  <div className="flex flex-row items-center justify-center gap-4">
                    {selectedPack === packOptions.AJEJA && (
                      <IconCircleCheckFilled className="flex h-6 w-6 text-primary"></IconCircleCheckFilled>
                    )}
                    {selectedPack !== packOptions.AJEJA && (
                      <IconCircleCheck className="flex h-6 w-6 text-primary"></IconCircleCheck>
                    )}
                    <div className="flex flex-col items-start justify-center">
                      <h1 className="text-md font-bold text-foreground">PACK 3JEJA</h1>
                      <p className="text-sm font-medium italic text-foreground">{tPricing('pay-once')}</p>
                    </div>
                  </div>
                  <h2 className="ml-2  flex text-xl font-semibold text-foreground">750 DT</h2>
                </div>
                <div
                  onClick={() => {
                    setValue('pack', packOptions.MACHROU3);
                    setSelectedPack(packOptions.MACHROU3);
                  }}
                  className={cn(
                    selectedPack === packOptions.MACHROU3 ? 'border-2 border-primary' : 'border border-input ',
                    'flex w-full cursor-pointer flex-row items-center justify-between rounded-lg  p-4',
                  )}>
                  <div className="flex flex-row items-center justify-center gap-4 ">
                    {selectedPack === packOptions.MACHROU3 && (
                      <IconCircleCheckFilled className="flex h-6 w-6 text-primary"></IconCircleCheckFilled>
                    )}
                    {selectedPack !== packOptions.MACHROU3 && (
                      <IconCircleCheck className="flex h-6 w-6 text-primary"></IconCircleCheck>
                    )}
                    <div className="flex flex-col items-start justify-center">
                      <h1 className="text-md font-bold text-foreground">PACK MACHROU3</h1>
                      <p className="text-sm font-medium italic text-foreground">{tPricing('pay-once')}</p>
                    </div>
                  </div>
                  <h2 className="ml-4  flex text-xl font-semibold text-foreground">1500 DT</h2>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="mx-auto flex w-full max-w-[25rem] justify-center pb-8 pt-4">
          <Button type="submit" size="default" disabled={isLoading}>
            {isLoading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
            {!isLoading && <IconDeviceFloppy className="mr-2 h-5 w-5 " />}
            {t('save-button')}
          </Button>
        </div>
      </form>
    </div>
  );
}
