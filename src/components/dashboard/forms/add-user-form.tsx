'use client';

import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import z from 'zod';
import { UserSchema } from '@/schemas';
import { AvatarFallback, Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { IconDeviceFloppy, IconLoader2, IconUserPlus } from '@tabler/icons-react';
import { toast } from '@/components/ui/use-toast';
import { LabelInputContainer } from '@/components/ui/label-input-container';
import { states, DEFAULT_PASSWORD, packOptions, roleOptions } from '@/lib/constants';
import { ActionResponse } from '@/types';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useRouter } from '@/navigation';
import { addUser } from '@/actions/users';
import { useCurrentRole } from '@/hooks/use-current-role';
import { Combobox } from '@/components/ui/combobox';

interface AddUserFormProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultRole: roleOptions;
}

export function AddUserForm({ defaultRole, className }: AddUserFormProps) {
  const role = useCurrentRole();

  const [isLoading, startTransition] = React.useTransition();
  const router = useRouter();
  const t = useTranslations('dashboard.text');
  const tFields = useTranslations('fields');
  const tValidation = useTranslations('validation');
  const [state, setState] = React.useState<string>();
  type schemaType = z.infer<typeof UserSchema>;

  let defaultValues;
  if (defaultRole === roleOptions.SELLER) {
    defaultValues = {
      pack: packOptions.DAMREJ,
      role: defaultRole,
      emailVerified: false,
      active: false,
      paid: false,
      pickupId: '0',
    };
  } else {
    defaultValues = {
      role: defaultRole,
      emailVerified: false,
      active: false,
      paid: false,
      storeName: 'N/A',
    };
  }

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<schemaType>({ resolver: zodResolver(UserSchema), defaultValues });

  const onSubmit: SubmitHandler<schemaType> = async (data, event) => {
    event?.preventDefault();
    startTransition(() => {
      addUser(data).then((res: ActionResponse) => {
        if (res.success) {
          toast({
            variant: 'success',
            title: tValidation('success-title'),
            description: tValidation(res.success),
          });
          router.push(`/dashboard/${role?.toLowerCase()}/${data.role?.toLowerCase()}s`);
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
                  <AvatarFallback>
                    <IconUserPlus className="h-12 w-12"></IconUserPlus>
                  </AvatarFallback>
                </Avatar>
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
                  id="number"
                  placeholder={tFields('user-number')}
                  type="tel"
                />
                {errors.number && <span className="text-xs text-red-400">{tValidation('number-error')}</span>}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="state">{tFields('user-state')}</Label>
                <Combobox
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
                {errors.state && <span className="text-xs text-red-400">{tValidation('state-error')}</span>}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="address">{tFields('user-address')}</Label>
                <Input
                  {...register('address')}
                  disabled={isLoading}
                  id="address"
                  placeholder={tFields('user-address')}
                  type="text"
                />
                {errors.address && <span className="text-xs text-red-400">{tValidation('address-error')}</span>}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="rib">{tFields('user-rib')}</Label>
                <Input
                  {...register('rib')}
                  disabled={isLoading}
                  id="rib"
                  placeholder={tFields('user-rib')}
                  type="tel"
                />
                {errors.rib && <span className="text-xs text-red-400">{tValidation('rib-error')}</span>}
              </LabelInputContainer>
              {defaultRole === roleOptions.SELLER && (
                <LabelInputContainer>
                  <Label htmlFor="pack">{tFields('user-pack')}</Label>
                  <Select
                    defaultValue={getValues('pack')}
                    onValueChange={(value: keyof typeof packOptions) => setValue('pack', packOptions[value])}>
                    <SelectTrigger disabled={isLoading}>
                      <SelectValue defaultValue={getValues('pack')} id="pack" placeholder={tFields('user-pack')} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(packOptions).map((option) => (
                        <SelectItem key={option} value={option as (typeof packOptions)[keyof typeof packOptions]}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.pack && <span className="text-xs text-red-400">{tValidation('pack-error')}</span>}
                </LabelInputContainer>
              )}
              <LabelInputContainer>
                <Label htmlFor="role">{tFields('user-role')}</Label>
                <Select
                  disabled
                  defaultValue={getValues('role')}
                  onValueChange={(value: keyof typeof roleOptions) => setValue('role', roleOptions[value])}>
                  <SelectTrigger disabled>
                    <SelectValue placeholder={tFields('user-role')} defaultValue={getValues('role')} id="role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(roleOptions).map((option) => (
                        <SelectItem key={option} value={option as (typeof roleOptions)[keyof typeof roleOptions]}>
                          {tFields(`user-${option.toLowerCase()}`)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.role && <span className="text-xs text-red-400">{tValidation('role-error')}</span>}
              </LabelInputContainer>
              {getValues('role') === roleOptions.SUPPLIER && (
                <LabelInputContainer>
                  <Label htmlFor="pickupId">{tFields('user-pickup-id')}</Label>
                  <Input {...register('pickupId')} id="pickupd" placeholder={tFields('user-pickup-id')} type="text" />
                  {errors.pickupId && <span className="text-xs text-red-400">{tValidation('pickup-id-error')}</span>}
                </LabelInputContainer>
              )}
              {getValues('role') === roleOptions.SELLER && (
                <LabelInputContainer>
                  <Label htmlFor="storeName">
                    {tFields('user-store-name')}
                    <span className="ml-2 text-xs text-gray-400">{t('user-store-name-note')}</span>
                  </Label>
                  <Input {...register('storeName')} id="pickupd" placeholder={tFields('user-store-name')} type="text" />
                  {errors.storeName && <span className="text-xs text-red-400">{tValidation('store-name-error')}</span>}
                </LabelInputContainer>
              )}
              <LabelInputContainer>
                <Label htmlFor="emailVerified">{tFields('user-email-verified')}</Label>
                <div className="flex h-10 w-full flex-row items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <div className="font-normal leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {t('user-email-verified-note')}
                  </div>
                  <Switch
                    defaultChecked={false}
                    onCheckedChange={(checked) => {
                      setValue('emailVerified', checked);
                    }}
                    id="emailVerified"
                  />
                </div>
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="active">{tFields('user-active')}</Label>
                <div className="flex h-10 w-full flex-row items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <div className="font-normal leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {t('user-active-note')}
                  </div>
                  <Switch
                    defaultChecked={false}
                    onCheckedChange={(checked) => setValue('active', checked)}
                    id="active"
                  />
                </div>
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="paid">{tFields('user-paid')}</Label>
                <div className="flex h-10 w-full flex-row items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <div className="font-normal leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {t('user-paid-note')}
                  </div>
                  <Switch defaultChecked={false} onCheckedChange={(checked) => setValue('paid', checked)} id="paid" />
                </div>
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="password">{tFields('user-password')}</Label>
                <Input disabled id="password" placeholder={`${t('password-note')}: ${DEFAULT_PASSWORD}`} type="text" />
              </LabelInputContainer>
            </div>
          </div>
          <div className="mx-auto flex w-full max-w-[25rem] justify-center pb-8 pt-16">
            <Button type="submit" className="h-12" size="default" disabled={isLoading}>
              {isLoading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
              {!isLoading && <IconDeviceFloppy className="mr-2 h-5 w-5 " />}
              {t('save-button')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
