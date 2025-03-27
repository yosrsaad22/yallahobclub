'use client';

import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { OnboardingOneSchema } from '@/schemas';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { IconDeviceFloppy, IconLoader2 } from '@tabler/icons-react';
import { toast } from '@/components/ui/use-toast';
import { LabelInputContainer } from '@/components/ui/label-input-container';
import { ActionResponse } from '@/types';
import { updateOnBoardingOne } from '@/actions/users';

export function OnBoardingForm1() {
  const [isLoading, startTransition] = React.useTransition();
  type schemaType = z.infer<typeof OnboardingOneSchema>;

  const defaultValues = {
    firstPartnerName: '',
    secondPartnerName: '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<schemaType>({ resolver: zodResolver(OnboardingOneSchema), defaultValues });

  const onSubmit: SubmitHandler<schemaType> = async (data, event) => {
    event?.preventDefault();
    startTransition(() => {
      updateOnBoardingOne(data).then((res: ActionResponse) => {
        if (res.success) {
          toast({
            variant: 'success',
            title: 'Succès',
            description: res.success,
          });
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
    <div className="flex h-full w-full max-w-5xl flex-col items-center pt-2">
      <form className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full rounded-lg border bg-background p-6">
          <div className="space-y-2">
            <h2 className="pb-4 text-lg font-semibold">Informations des Partenaires</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <LabelInputContainer>
                <Label htmlFor="firstPartnerName">Nom du Premier Partenaire</Label>
                <Input
                  {...register('firstPartnerName')}
                  id="firstPartnerName"
                  disabled={isLoading}
                  placeholder="Entrez le nom du premier partenaire"
                  type="text"
                />
                {errors.firstPartnerName && (
                  <span className="text-xs text-red-400">Le nom du premier partenaire est requis</span>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="secondPartnerName">Nom du Second Partenaire</Label>
                <Input
                  {...register('secondPartnerName')}
                  id="secondPartnerName"
                  disabled={isLoading}
                  placeholder="Entrez le nom du second partenaire"
                  type="text"
                />
                {errors.secondPartnerName && (
                  <span className="text-xs text-red-400">Le nom du second partenaire est requis</span>
                )}
              </LabelInputContainer>
            </div>
          </div>
          <div className="mx-auto flex w-full max-w-[25rem] justify-center pb-8 pt-16">
            <Button type="submit" className="h-12" size="default" disabled={isLoading}>
              {isLoading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
              {!isLoading && <IconDeviceFloppy className="mr-2 h-5 w-5 " />}
              Continuer
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
