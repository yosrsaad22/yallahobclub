'use client';

import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { OnboardingTwoSchema } from '@/schemas';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { IconDeviceFloppy, IconLoader2 } from '@tabler/icons-react';
import { toast } from '@/components/ui/use-toast';
import { LabelInputContainer } from '@/components/ui/label-input-container';
import { ActionResponse } from '@/types';
import { updateOnBoardingTwo } from '@/actions/users';

export function OnBoardingForm2() {
  const [isLoading, startTransition] = React.useTransition();
  type schemaType = z.infer<typeof OnboardingTwoSchema>;

  const defaultValues = {
    yearsKnownEachOther: 0,
    yearsMarried: 0,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<schemaType>({ resolver: zodResolver(OnboardingTwoSchema), defaultValues });

  const onSubmit: SubmitHandler<schemaType> = async (data, event) => {
    event?.preventDefault();
    startTransition(() => {
      updateOnBoardingTwo(data).then((res: ActionResponse) => {
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
            <h2 className="pb-4 text-lg font-semibold">Durée de la Relation</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <LabelInputContainer>
                <Label htmlFor="yearsKnownEachOther">Années de Connaissance</Label>
                <Input
                  {...register('yearsKnownEachOther', { valueAsNumber: true })}
                  id="yearsKnownEachOther"
                  disabled={isLoading}
                  placeholder="Nombre d'années"
                  type="number"
                />
                {errors.yearsKnownEachOther && (
                  <span className="text-xs text-red-400">Le nombre d'années est requis</span>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="yearsMarried">Années de Mariage</Label>
                <Input
                  {...register('yearsMarried', { valueAsNumber: true })}
                  id="yearsMarried"
                  disabled={isLoading}
                  placeholder="Nombre d'années"
                  type="number"
                />
                {errors.yearsMarried && <span className="text-xs text-red-400">Le nombre d'années est requis</span>}
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
