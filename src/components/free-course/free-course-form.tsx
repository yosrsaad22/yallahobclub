'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Input } from '@/components/ui/aceternity-input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import z from 'zod';
import { useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import React from 'react';
import { IconLoader2 } from '@tabler/icons-react';
import { freeCourseVariants2, freeCourseVariants1, freeCourseVariants3 } from '@/lib/framer-variants';
import ReactPlayer from 'react-player';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button, GradientButton, GradientLinkButton, LinkButton } from '@/components/ui/button';
import { LabelInputContainer } from '@/components/ui/label-input-container';
import { EnrollSchema } from '@/schemas';
import { enroll, saveVideoProgress } from '@/actions/leads';
import { FormError } from '../ui/form-error';
import { ActionResponse } from '@/types';
import { MEDIA_HOSTNAME } from '@/lib/constants';
import { OnProgressProps } from 'react-player/base';
import { throttle } from 'lodash';

const throttledSaveProgress = throttle(async (userId, videoProgress) => {
  await saveVideoProgress(userId, videoProgress);
}, 30000);

interface FreeCourseFormProps extends React.HTMLAttributes<HTMLDivElement> {
  videoKey: string;
}

export const FreeCourseForm = ({ videoKey }: FreeCourseFormProps) => {
  const t = useTranslations('free-course');
  const tFields = useTranslations('fields');
  const tValidation = useTranslations('validation');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hideForm, setHideForm] = useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [canBuyCourse, setCanBuyCourse] = React.useState(false);
  const [isLoading, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | undefined>('');
  const [watchedTime, setWatchedTime] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('currentTime');
  const [userId, setUserId] = useState('');
  const playerRef = useRef<ReactPlayer>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  type schemaType = z.infer<typeof EnrollSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<schemaType>({ resolver: zodResolver(EnrollSchema) });

  function scrollToVideo() {
    if (isMobile) {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }, 1700);
    }
  }

  const onSubmit: SubmitHandler<schemaType> = (data, event) => {
    event?.preventDefault();
    setError('');

    startTransition(() => {
      enroll(data).then((res: ActionResponse) => {
        if (res.error) {
          setError(tValidation(res.error));
        } else {
          setUserId(res.data);
          setIsSubmitted(true);
          scrollToVideo();
          toast({
            className: 'dark',
            variant: 'primary',
            title: t('toast-title'),
            description: t('toast-text'),
          });
          setTimeout(() => {
            setHideForm(true);
          }, 4000);
        }
      });
    });
  };

  async function handleProgress(progressProps: OnProgressProps) {
    if (isSubmitted) {
      const currentTime = progressProps.playedSeconds;
      if (!playerRef.current?.getInternalPlayer().seeking) {
        if (currentTime > watchedTime) {
          setWatchedTime(currentTime);
          setLastUpdated('watchedTime');
        } else {
          setLastUpdated('currentTime');
        }
      }
      const watchedPercentage = (watchedTime / progressProps.loadedSeconds) * 100;
      throttledSaveProgress(userId, watchedPercentage);
      if (watchedPercentage > 0.01) {
        setCanBuyCourse(true);
        /*
        if (!hasDialogBeenOpened) {
          if (document.fullscreenElement) {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            }
          }
          setIsDialogOpen(true);
          setHasDialogBeenOpened(true);
        }
          */
      }
    }
  }

  const handleSeek = (seconds: number) => {
    const currentTime = seconds;
    if (currentTime > watchedTime && playerRef.current) {
      playerRef.current.seekTo(watchedTime);
    } else {
      setWatchedTime(currentTime);
    }
  };

  return (
    <div className="flex w-full flex-col items-center justify-center ">
      <motion.div
        variants={freeCourseVariants3}
        initial="initial"
        animate={canBuyCourse ? 'animate' : 'initial'}
        className="flex flex-row justify-center pb-24   pt-12 md:pb-20 md:pt-6">
        <GradientLinkButton
          innerClassName={'bg-background hover:bg-gray-800 active:bg-gray-800'}
          rounded={'full'}
          size={'full'}
          href={'/full-course'}>
          {t('buy-button')}
        </GradientLinkButton>
      </motion.div>

      <div
        className={cn(
          !isSubmitted ? '-mt-16' : 'mt-0',
          'flex h-full  w-full  flex-col items-center  justify-center  md:h-[33rem] md:flex-row md:gap-16 md:gap-x-8',
        )}>
        <motion.div
          variants={freeCourseVariants1}
          initial="initial"
          animate={isSubmitted && !isMobile ? 'animate' : 'initial'}
          className={cn(
            'mb-16 flex h-full  w-full flex-col items-center justify-center px-8 md:mb-32 md:w-[45%] md:max-w-4xl',
          )}>
          <div className="flex  w-full  translate-y-[-1rem] animate-fade-in  flex-col items-center justify-center  overflow-hidden rounded-sm border-2  border-[#6C6C6C] bg-[#222222] opacity-0 [--animation-delay:400ms]">
            {isSubmitted ? (
              <ReactPlayer
                config={{
                  file: { attributes: { controlsList: 'nodownload' } },
                }}
                ref={playerRef}
                onProgress={handleProgress}
                onSeek={handleSeek}
                controls
                height={'100%'}
                width={'100%'}
                url={`${MEDIA_HOSTNAME}${videoKey}`}
              />
            ) : (
              <Image
                src={'/img/course.webp'}
                alt="videofallback"
                height={720}
                width={1400}
                className="object-fit h-full w-full "
                draggable={false}
              />
            )}
          </div>
        </motion.div>
        <motion.div
          variants={freeCourseVariants2}
          initial="initial"
          animate={isSubmitted ? 'animate' : 'initial'}
          className={cn('flex h-full w-full flex-col items-center justify-center px-8 md:w-[45%]')}>
          <div
            style={{ display: hideForm ? 'none' : 'flex flex-col' }}
            className="w-full translate-y-[-1rem] animate-fade-in  opacity-0 [--animation-delay:400ms]">
            <div>
              <h1 className=" text-gradient mb-4 mt-8 py-2 text-center text-4xl font-semibold tracking-tight md:p-0 md:text-center">
                {t('form-title')}
              </h1>
              <p className="mb-4 text-center text-sm text-muted-foreground">{t('text')}</p>
            </div>
            <form className="w-full py-4" onSubmit={handleSubmit(onSubmit)}>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="fullName">{tFields('user-full-name')}</Label>
                <Input
                  {...register('fullName')}
                  id="fullName"
                  disabled={isLoading}
                  placeholder={tFields('user-full-name')}
                  type="text"
                  className="bg-[#282b32]"
                />
                {errors.fullName && <span className="text-xs text-red-400">{tValidation('fullname-error')}</span>}
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="number">{tFields('user-number')}</Label>
                <Input
                  {...register('number')}
                  id="number"
                  disabled={isLoading}
                  placeholder={tFields('user-number')}
                  type="text"
                  className="bg-[#282b32]"
                />
                {errors.number && <span className="text-xs text-red-400">{tValidation('number-error')}</span>}
              </LabelInputContainer>
              <LabelInputContainer className="">
                <Label htmlFor="email">{tFields('user-email')}</Label>
                <Input
                  {...register('email')}
                  id="email"
                  disabled={isLoading}
                  placeholder="Email@email.com"
                  type="email"
                  className="bg-[#282b32]"
                />
                {errors.email && <span className="text-xs text-red-400">{tValidation('email-error')}</span>}
              </LabelInputContainer>
              <FormError message={error} />
              <div className="my-10 text-center">
                <GradientButton
                  disabled={isLoading}
                  onClick={handleSubmit(onSubmit)}
                  rounded="md"
                  innerClassName="bg-[#101619] hover:bg-gray-800 active:bg-gray-800 "
                  size={'full'}>
                  {isLoading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}

                  {t('watch-button')}
                </GradientButton>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
