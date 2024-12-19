'use client';

import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import z from 'zod';
import { OnBoardingSchema } from '@/schemas';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { IconCheck, IconCircleCheck, IconLoader2 } from '@tabler/icons-react';
import { toast } from '@/components/ui/use-toast';
import { LabelInputContainer } from '@/components/ui/label-input-container';
import { UploadButton } from '@/lib/uploadthing';
import { useSession } from 'next-auth/react';
import { ActionResponse, DataTableUser } from '@/types';
import { CompleteOnBoarding } from '@/actions/users';
import { useRouter } from '@/navigation';
import { fireworksConfetti } from '@/components/ui/confetti';
import { useCurrentUser } from '@/hooks/use-current-user';
import { roleOptions } from '@/lib/constants';

interface OnBoardingFormProps extends React.HTMLAttributes<HTMLDivElement> {}
export function OnBoardingForm({ className }: OnBoardingFormProps) {
  const [isLoading, startTransition] = React.useTransition();
  const t = useTranslations('dashboard.text');
  const tFields = useTranslations('fields');
  const tValidation = useTranslations('validation');
  const session = useSession();
  const [isFrontUploaded, setIsFrontUploaded] = React.useState(false);
  const [isBackUploaded, setIsBackUploaded] = React.useState(false);
  const router = useRouter();
  const user = useCurrentUser();

  type schemaType = z.infer<typeof OnBoardingSchema>;

  const defaultValues = {
    storeName: user?.role === roleOptions.SELLER ? null : 'ECOMNESS',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<schemaType>({ resolver: zodResolver(OnBoardingSchema) });

  const onSubmit: SubmitHandler<schemaType> = async (data, event) => {
    event?.preventDefault();
    startTransition(() => {
      CompleteOnBoarding(data).then((res: ActionResponse) => {
        if (res.success) {
          toast({
            variant: 'success',
            title: tValidation('success-title'),
            description: tValidation(res.success),
          });
          fireworksConfetti();
          setTimeout(() => {
            session.update();
            router.refresh();
          }, 2000);
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
  //Scroll animation hne zid w blur effect w haja 3d ken fama

  return (
    <div className="custom-scrollbar flex   flex-col overflow-y-auto">
      <div className="mx-auto flex h-full w-full flex-col  items-center gap-8 p-8 md:w-[60%]">
        <form className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full rounded-lg border bg-background p-6">
            <div className="space-y-6">
              <div className="flex flex-col gap-2 py-3">
                <h2 className="text-center text-2xl font-semibold">{t('on-boarding-title')}</h2>
                <p className="text-center text-sm text-muted-foreground">{t('on-boarding-description')}</p>
              </div>

              <div className="flex flex-col gap-6 md:flex-row">
                {user?.role === roleOptions.SELLER && (
                  <LabelInputContainer className="flex-1">
                    <Label htmlFor="storeName">{tFields('user-store-name')}</Label>
                    <Input
                      {...register('storeName')}
                      id="storeName"
                      disabled={isLoading}
                      placeholder={tFields('user-store-name')}
                      type="text"
                    />
                    {errors.storeName && (
                      <span className="text-xs text-red-400">{tValidation('store-name-error')}</span>
                    )}
                  </LabelInputContainer>
                )}
                <LabelInputContainer className="flex-1">
                  <Label htmlFor="rib">{tFields('user-rib')}</Label>
                  <Input
                    {...register('rib')}
                    disabled={isLoading}
                    id="rib"
                    placeholder={tFields('user-rib')}
                    type="text"
                  />
                  {errors.rib && <span className="text-xs text-red-400">{tValidation('rib-error')}</span>}
                </LabelInputContainer>
              </div>
              <LabelInputContainer className="">
                <Label>{tFields('user-cin-1')} </Label>
                <div className="flex flex-col items-center justify-between gap-2 rounded-md border border-border p-3 md:flex-row">
                  <p className="max-w-full text-sm text-muted-foreground md:max-w-[60%]">{t('cin-1-note')}</p>
                  {isFrontUploaded ? (
                    <IconCircleCheck className="h-9 w-9 animate-pulse text-success" />
                  ) : (
                    <UploadButton
                      className={`flex flex-col items-center justify-center gap-1 text-sm ut-button:rounded-md ut-button:border-none ut-button:bg-foreground ut-button:text-sm ut-button:font-semibold ut-button:text-background ut-button:ring-offset-background ut-button:focus-within:bg-foreground ut-button:hover:bg-foreground/80 ut-button:focus:bg-foreground ut-button:focus-visible:outline-none ut-button:focus-visible:ring-2 ut-button:focus-visible:ring-ring ut-button:focus-visible:ring-offset-2 ut-button:active:bg-foreground ut-uploading:pointer-events-none ${className}`}
                      appearance={{
                        button:
                          'focus-within:ring-foreground ut-ready:bg-foreground ut-uploading:cursor-not-allowed after:bg-foreground',
                        allowedContent: 'hidden',
                      }}
                      content={{
                        button({ ready, isUploading }) {
                          if (isUploading) return <IconLoader2 className="z-[5] h-5 w-5 animate-spin" />;
                          if (!ready) return <IconLoader2 className="z-[5] h-5 w-5 animate-spin" />;

                          return <div>{t('upload')}</div>;
                        },
                      }}
                      endpoint="CIN1"
                      onClientUploadComplete={(res) => {
                        session.update();
                        setIsFrontUploaded(true);

                        setValue('CIN1', res[0].key);
                      }}
                      onUploadError={(error: Error) => {
                        toast({
                          variant: 'destructive',
                          title: tValidation('error-title'),
                          description: tValidation('image-upload-error'),
                        });
                      }}
                    />
                  )}
                </div>
                {errors.CIN1 && <span className="text-xs text-red-400">{tValidation('cin-1-error')}</span>}
              </LabelInputContainer>
              <LabelInputContainer className="">
                <Label>{tFields('user-cin-2')} </Label>
                <div className="flex flex-col items-center justify-between gap-2 rounded-md border border-border p-3 md:flex-row">
                  <p className="max-w-full text-sm text-muted-foreground md:max-w-[60%]">{t('cin-2-note')}</p>
                  {isBackUploaded ? (
                    <IconCircleCheck className="h-9 w-9 animate-pulse text-success" />
                  ) : (
                    <UploadButton
                      className={`flex flex-col items-center justify-center gap-1 text-sm ut-button:rounded-md ut-button:border-none ut-button:bg-foreground ut-button:text-sm ut-button:font-semibold ut-button:text-background ut-button:ring-offset-background ut-button:focus-within:bg-foreground ut-button:hover:bg-foreground/80 ut-button:focus:bg-foreground ut-button:focus-visible:outline-none ut-button:focus-visible:ring-2 ut-button:focus-visible:ring-ring ut-button:focus-visible:ring-offset-2 ut-button:active:bg-foreground ut-uploading:pointer-events-none ${className}`}
                      appearance={{
                        button:
                          'focus-within:ring-foreground ut-ready:bg-foreground ut-uploading:cursor-not-allowed after:bg-foreground',
                        allowedContent: 'hidden',
                      }}
                      content={{
                        button({ ready, isUploading }) {
                          if (isUploading) return <IconLoader2 className="z-[5] h-5 w-5 animate-spin" />;
                          if (!ready) return <IconLoader2 className="z-[5] h-5 w-5 animate-spin" />;

                          return <div>{t('upload')}</div>;
                        },
                      }}
                      endpoint="CIN2"
                      onClientUploadComplete={(res) => {
                        session.update();
                        setIsBackUploaded(true);
                        console.log(res[0].key);
                        setValue('CIN2', res[0].key);
                      }}
                      onUploadError={(error: Error) => {
                        toast({
                          variant: 'destructive',
                          title: tValidation('error-title'),
                          description: tValidation('image-upload-error'),
                        });
                      }}
                    />
                  )}
                </div>
                {errors.CIN2 && <span className="text-xs text-red-400">{tValidation('cin-2-error')}</span>}
              </LabelInputContainer>
              <div className="mt-4 flex items-center justify-center">
                <Button type="submit" variant={'primary'} size="default" disabled={isLoading}>
                  {isLoading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {!isLoading && <IconCheck className="mr-2 h-5 w-5 " />}
                  {t('get-started')}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
