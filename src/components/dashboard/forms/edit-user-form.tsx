'use client';

import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import z from 'zod';
import { UserSchema } from '@/schemas';
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { IconCircleCheck, IconDeviceFloppy, IconLetterC, IconLoader2, IconUser } from '@tabler/icons-react';
import { toast } from '@/components/ui/use-toast';
import { LabelInputContainer } from '@/components/ui/label-input-container';
import { states, MEDIA_HOSTNAME, packOptions, roleOptions } from '@/lib/constants';
import { ActionResponse, DataTableUser } from '@/types';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { editUser } from '@/actions/users';
import { getUserProgress } from '@/actions/course';
import { useRouter } from '@/navigation';
import { formatDate } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { useCurrentRole } from '@/hooks/use-current-role';
import { Combobox } from '@/components/ui/combobox';
import { set } from 'lodash';
import Image from 'next/image';

interface EditUserFormProps extends React.HTMLAttributes<HTMLDivElement> {
  userData: DataTableUser | null;
}
export function EditUserForm({ className, userData }: EditUserFormProps) {
  const role = useCurrentRole();

  const [isLoading, startTransition] = React.useTransition();
  const router = useRouter();
  const t = useTranslations('dashboard.text');
  const tFields = useTranslations('fields');
  const tValidation = useTranslations('validation');
  const [state, setState] = React.useState<string>(userData?.state ?? '');
  type schemaType = z.infer<typeof UserSchema>;
  const [userRole, setUserRole] = React.useState(userData?.role!);
  const [userPack, setUserPack] = React.useState(userData?.pack!);

  const [userBoardedState, setUserBoardedState] = React.useState(userData?.boarded!);
  const boardingStates = ['not-started', 'documents-uploaded', 'on-boarding-completed'];

  const [emailVerified, setEmailVerified] = React.useState(userData?.emailVerified ? true : false);
  const [progress, setProgress] = React.useState({ completedChapters: 0, totalChapters: 0 });
  let defaultValues;
  if (userData?.role == roleOptions.SELLER) {
    defaultValues = {
      pack: packOptions[userData?.pack!],
      role: roleOptions[userData?.role!] as roleOptions,
      emailVerified: emailVerified,
      active: userData?.active!,
      paid: userData?.paid!,
      state: userData?.state!,
      pickupId: '0',
      boarded: userData?.boarded,
    };
  } else {
    defaultValues = {
      role: roleOptions[userData?.role!] as roleOptions,
      emailVerified: emailVerified,
      active: userData?.active!,
      state: userData?.state!,
      paid: userData?.paid!,
      pickupId: userData?.pickupId ?? undefined,
      storeName: 'N/A',
      boarded: userData?.boarded,
    };
  }

  React.useEffect(() => {
    if (userPack !== userData?.pack) {
      setValue('paid', false);
    } else {
      setValue('paid', userData.paid);
    }
  }, [userPack]);

  const progressPercentage = Math.round((progress.completedChapters / progress.totalChapters) * 100);

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<schemaType>({ resolver: zodResolver(UserSchema), defaultValues });

  React.useEffect(() => {
    const fetchUserProgress = async () => {
      if (userData?.id) {
        const res = await getUserProgress(userData?.id!);
        setProgress(res.data);
      }
    };
    fetchUserProgress();
  }, [userData?.id]);

  const onSubmit: SubmitHandler<schemaType> = async (data, event) => {
    event?.preventDefault();
    startTransition(() => {
      editUser(userData?.id!, data).then((res: ActionResponse) => {
        if (res.success) {
          toast({
            variant: 'success',
            title: tValidation('success-title'),
            description: tValidation(res.success),
          });
          router.push(`/dashboard/admin/${data.role?.toLowerCase()}s`);
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
                    src={`${MEDIA_HOSTNAME}${userData?.image}`}
                    alt={userData?.fullName ?? ''}
                  />
                  <AvatarFallback className="text-4xl">
                    {' '}
                    <IconUser className="h-14 w-14" />
                  </AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold">{userData?.fullName}</h1>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-x-0 gap-y-6 pb-6 md:flex-row md:gap-x-6 md:gap-y-0">
              <div className="flex w-full flex-col md:w-1/2">
                <h2 className=" text-lg font-semibold">{t('user-information')} </h2>
                <p className=" text-sm font-medium text-muted-foreground">
                  {tFields('user-created-at')} {formatDate(userData?.createdAt!)}
                </p>
              </div>
              {userRole == roleOptions.SELLER && userPack !== packOptions.DAMREJ && (
                <div className="flex w-full flex-col items-start justify-center md:w-1/2">
                  <h2 className="pb-1 text-lg font-semibold">
                    {t('user-progress')}
                    <span className=" ml-2 text-sm font-medium text-muted-foreground">
                      {progress.completedChapters}/{progress.totalChapters} {t('chapters')}
                    </span>
                  </h2>
                  <Progress value={progress.totalChapters === 0 ? 0 : progressPercentage} className="h-5 text-xs" />
                </div>
              )}{' '}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {role === roleOptions.ADMIN && (
                <LabelInputContainer>
                  <Label htmlFor="code">{tFields('user-code')}</Label>
                  <Input
                    id="code"
                    defaultValue={userData?.code ?? ''}
                    placeholder={tFields('user-code')}
                    type="text"
                    disabled
                  />
                </LabelInputContainer>
              )}

              <LabelInputContainer>
                <Label htmlFor="fullName">{tFields('user-full-name')}</Label>
                <Input
                  {...register('fullName')}
                  id="fullName"
                  disabled={isLoading}
                  defaultValue={userData?.fullName ?? ''}
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
                  defaultValue={userData?.email ?? ''}
                  id="email"
                  placeholder={tFields('user-email')}
                  type="email"
                  onChange={(event) => {
                    if (event.target?.value !== userData?.email) {
                      setEmailVerified(false);
                      setValue('emailVerified', false);
                    } else {
                      setEmailVerified(true);
                      setValue('emailVerified', true);
                    }
                  }}
                />
                {errors.email && <span className="text-xs text-red-400">{tValidation('email-error')}</span>}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="number">{tFields('user-number')}</Label>
                <Input
                  {...register('number')}
                  disabled={isLoading}
                  defaultValue={userData?.number ?? ''}
                  id="number"
                  placeholder={tFields('user-number')}
                  type="tel"
                />
                {errors.number && <span className="text-xs text-red-400">{tValidation('number-error')}</span>}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label>{tFields('user-state')}</Label>
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
                <Label htmlFor="city">{tFields('user-city')}</Label>
                <Input
                  {...register('city')}
                  defaultValue={userData?.city ?? ''}
                  disabled={isLoading}
                  id="city"
                  placeholder={tFields('user-city')}
                  type="text"
                />
                {errors.city && <span className="text-xs text-red-400">{tValidation('city-error')}</span>}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="address">{tFields('user-address')}</Label>
                <Input
                  {...register('address')}
                  defaultValue={userData?.address ?? ''}
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
                  defaultValue={userData?.rib ?? ''}
                  disabled={isLoading}
                  id="rib"
                  placeholder={tFields('user-rib')}
                  type="tel"
                />
                {errors.rib && <span className="text-xs text-red-400">{tValidation('rib-error')}</span>}
              </LabelInputContainer>
              {userRole === roleOptions.SELLER && (
                <LabelInputContainer>
                  <Label htmlFor="pack">{tFields('user-pack')}</Label>
                  <Select
                    defaultValue={getValues('pack')}
                    onValueChange={(value: keyof typeof packOptions) => {
                      setUserPack(packOptions[value]);
                      setValue('pack', packOptions[value]);
                    }}>
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
                  defaultValue={getValues('role')}
                  onValueChange={(value: keyof typeof roleOptions) => {
                    setUserRole(roleOptions[value]);
                    setValue('role', roleOptions[value]);
                  }}>
                  <SelectTrigger disabled={isLoading}>
                    <SelectValue placeholder={tFields('user-role')} defaultValue={getValues('role')} id="role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Object.values(roleOptions)
                        .filter((option) => option !== roleOptions.ADMIN)
                        .map((option) => (
                          <SelectItem key={option} value={option as (typeof roleOptions)[keyof typeof roleOptions]}>
                            {tFields(`user-${option.toLowerCase()}`)}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.role && <span className="text-xs text-red-400">{tValidation('role-error')}</span>}
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="balance">{tFields('user-balance')}</Label>
                <Input
                  defaultValue={userData?.balance + ' TND'}
                  disabled={true}
                  id="balance"
                  placeholder={tFields('user-balance')}
                  type="text"
                />
              </LabelInputContainer>
              {userRole === roleOptions.SUPPLIER && (
                <LabelInputContainer>
                  <Label htmlFor="pickupId">{tFields('user-pickup-id')}</Label>
                  <Input
                    defaultValue={userData?.pickupId ?? undefined}
                    {...register('pickupId')}
                    id="pickupd"
                    placeholder={tFields('user-pickup-id')}
                    type="text"
                  />
                  {errors.pickupId && <span className="text-xs text-red-400">{tValidation('pickup-id-error')}</span>}
                </LabelInputContainer>
              )}
              {userRole === roleOptions.SELLER && (
                <LabelInputContainer>
                  <Label htmlFor="storeName">
                    {tFields('user-store-name')}
                    <span className="ml-2 text-xs text-gray-400">{t('user-store-name-note')}</span>
                  </Label>
                  <Input
                    {...register('storeName')}
                    defaultValue={userData?.storeName ?? undefined}
                    id="storeName"
                    placeholder={tFields('user-store-name')}
                    type="text"
                  />
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
                    defaultChecked={emailVerified}
                    checked={emailVerified}
                    onCheckedChange={(checked) => {
                      setEmailVerified(checked);
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
                    defaultChecked={userData?.active ?? false}
                    onCheckedChange={(checked) => setValue('active', checked)}
                    id="active"
                  />
                </div>
              </LabelInputContainer>
              {userRole === roleOptions.SELLER && (
                <LabelInputContainer>
                  <Label htmlFor="paid">{tFields('user-paid')}</Label>
                  <div className="flex h-10 w-full flex-row items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <div className="font-normal leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {t('user-paid-note')}
                    </div>
                    {userPack === userData?.pack && userData.paid === false && (
                      <Switch
                        defaultChecked={userData.paid}
                        onCheckedChange={(checked) => setValue('paid', checked)}
                        id="paid"
                      />
                    )}
                    {userPack === userData?.pack && userData.paid === true && (
                      <IconCircleCheck className="h-8 w-8 text-success" />
                    )}
                    {userPack !== userData?.pack && (
                      <Switch
                        defaultChecked={false}
                        onCheckedChange={(checked) => setValue('paid', checked)}
                        id="paid"
                      />
                    )}
                  </div>
                </LabelInputContainer>
              )}
              <LabelInputContainer>
                <Label htmlFor="boarded">{tFields('user-boarded')}</Label>
                <Select
                  defaultValue={boardingStates[getValues('boarded')]}
                  onValueChange={(value) => {
                    setUserBoardedState(boardingStates.indexOf(value));
                    setValue('boarded', boardingStates.indexOf(value));
                  }}>
                  <SelectTrigger disabled={isLoading}>
                    <SelectValue
                      defaultValue={boardingStates[getValues('boarded')]}
                      id="boarded"
                      placeholder={tFields('user-boarded')}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(boardingStates).map((option) => (
                      <SelectItem key={option} value={option as (typeof packOptions)[keyof typeof packOptions]}>
                        {t(option)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </LabelInputContainer>
              {userBoardedState !== 0 && (
                <LabelInputContainer className="col-span-1 md:col-span-2">
                  <Label htmlFor="documents">{tFields('user-documents')}</Label>
                  <div className="flex flex-col  items-center justify-center gap-6 rounded-md border border-border p-4 md:flex-row">
                    <Image alt="CIN1" src={`${MEDIA_HOSTNAME}${userData?.CIN1}`} width={200} height={200} />
                    <Image alt="CIN1" src={`${MEDIA_HOSTNAME}${userData?.CIN2}`} width={200} height={200} />
                  </div>
                </LabelInputContainer>
              )}
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
