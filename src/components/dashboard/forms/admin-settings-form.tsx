'use client';

import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import z from 'zod';
import { AdminSettingsSchema } from '@/schemas';
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { IconDeviceFloppy, IconLoader2, IconUser } from '@tabler/icons-react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { adminEditSettings } from '@/actions/settings';
import { CompanyInfo } from '@prisma/client';
import { toast } from '@/components/ui/use-toast';
import { LabelInputContainer } from '@/components/ui/label-input-container';
import { UploadButton } from '@/lib/uploadthing';
import { cities, MEDIA_HOSTNAME } from '@/lib/constants';
import { useSession } from 'next-auth/react';
import { ActionResponse } from '@/types';
import { Combobox } from '@/components/ui/combobox';

interface AdminSettingsFormProps extends React.HTMLAttributes<HTMLDivElement> {
  companyInfo: CompanyInfo | null;
}
export function AdminSettingsForm({ className, companyInfo }: AdminSettingsFormProps) {
  const [isLoading, startTransition] = React.useTransition();
  const t = useTranslations('dashboard.text');
  const tFields = useTranslations('fields');
  const tValidation = useTranslations('validation');
  const user = useCurrentUser();
  const session = useSession();

  type schemaType = z.infer<typeof AdminSettingsSchema>;
  const [city, setCity] = React.useState<string>(user?.city ?? '');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<schemaType>({ resolver: zodResolver(AdminSettingsSchema) });

  const onSubmit: SubmitHandler<schemaType> = async (data, event) => {
    event?.preventDefault();
    startTransition(() => {
      adminEditSettings(data).then((res: ActionResponse) => {
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
    <div className="flex h-full w-full flex-col items-center pt-2">
      <form className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full rounded-lg border bg-background p-6">
          <div className="space-y-2">
            <div className="w-full rounded-lg p-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage
                    className="object-cover"
                    src={`${MEDIA_HOSTNAME}${user?.image}`}
                    alt={user?.name ?? ''}
                  />
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
        <div className="w-full space-y-6 rounded-lg border bg-background p-6">
          <div className="space-y-2">
            <div className="flex flex-row items-center pb-4">
              <h2 className="text-lg font-semibold">{t('company-information')}</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <LabelInputContainer>
                <Label htmlFor="rib">{tFields('company-rib')}</Label>
                <Input
                  {...register('rib')}
                  disabled={isLoading}
                  id="rib"
                  defaultValue={companyInfo?.rib ?? ''}
                  placeholder={tFields('company-rib')}
                  type="tel"
                />
                {errors.rib && <span className="text-xs text-red-400">{tValidation('rib-error')}</span>}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="fiscalId">{tFields('company-fiscal-id')}</Label>
                <Input
                  {...register('fiscalId')}
                  disabled={isLoading}
                  id="fiscalId"
                  defaultValue={companyInfo?.fiscalId ?? ''}
                  placeholder={tFields('company-fiscal-id')}
                  type="text"
                />
                {errors.fiscalId && <span className="text-xs text-red-400">{tValidation('fiscal-id-error')}</span>}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="tva">{tFields('company-tva')} (%)</Label>
                <Input
                  {...register('tva')}
                  disabled={isLoading}
                  id="tva"
                  defaultValue={companyInfo?.tva ?? ''}
                  placeholder={tFields('company-tva')}
                  type="text"
                />
                {errors.tva && <span className="text-xs text-red-400">{tValidation('tva-error')}</span>}
              </LabelInputContainer>
            </div>
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-[25rem] justify-center pb-8 pt-4">
          <Button type="submit" size="default" className="h-12" disabled={isLoading}>
            {isLoading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
            {!isLoading && <IconDeviceFloppy className="mr-2 h-5 w-5 " />}
            {t('save-button')}
          </Button>
        </div>
      </form>
    </div>
  );
}
