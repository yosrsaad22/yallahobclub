'use client';

import { Chapter, Course } from '@prisma/client';
import * as React from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { MEDIA_HOSTNAME, localeOptions } from '@/lib/constants';
import ReactPlayer from 'react-player';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  IconCheck,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconLoader2,
  IconPlayerPlayFilled,
} from '@tabler/icons-react';
import { setChapterCompleted } from '@/actions/course';
import { useCurrentUser } from '@/hooks/use-current-user';
import { ActionResponse } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { fireworksConfetti } from '@/components/ui/confetti';
import { CourseCompleteDialog } from '../dialogs/course-complete-dialog';
import { useSidebar } from '@/hooks/use-sidebar';
import { TextPreview } from '@/components/ui/text-preview';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CoursePlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  course: Course;
  chapters: Chapter[];
  userProgress: {
    completedChapters: number;
    totalChapters: number;
  };
}

type ChapterWithCompletion = Chapter & { completed?: boolean };

export function CoursePlayer({ course, chapters, userProgress }: CoursePlayerProps) {
  const locale = useLocale();
  const t = useTranslations('dashboard.course');
  const tValidation = useTranslations('validation');
  const [newChapters, setNewChapters] = React.useState<ChapterWithCompletion[]>(chapters);
  const [currentChapter, setCurrentChapter] = React.useState<ChapterWithCompletion>(chapters[0]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const user = useCurrentUser();
  const { isMinimized, toggle } = useSidebar();
  const [isDescriptionLoading, setIsDescriptionLoading] = React.useState(true);

  React.useEffect(() => {
    const updatedChapters = chapters.map((chapter, index) => ({
      ...chapter,
      completed: index + 1 <= userProgress.completedChapters,
    }));

    const lastCompletedChapterIndex = updatedChapters.findIndex((chapter) => !chapter.completed) - 1;
    const currentChapterIndex = lastCompletedChapterIndex >= 0 ? lastCompletedChapterIndex + 1 : 0;

    setCurrentChapter(updatedChapters[currentChapterIndex]);
    setNewChapters(updatedChapters);

    const timeout = setTimeout(() => {
      setIsLoading(false);
      setIsDescriptionLoading(false);
    }, 2500);

    return () => clearTimeout(timeout);
  }, [chapters, userProgress.completedChapters]);

  const handleChapterCompleted = async () => {
    setIsLoading(true);
    if (user?.id) {
      await setChapterCompleted(user?.id, currentChapter.id).then((res: ActionResponse) => {
        setIsLoading(false);
        if (res.success) {
          const updatedChapters = newChapters.map((chapter) => {
            if (chapter.id === currentChapter.id) {
              return {
                ...chapter,
                completed: true,
              };
            }
            return chapter;
          });
          setNewChapters(updatedChapters);
          fireworksConfetti();

          if (currentChapter.id === newChapters[newChapters.length - 1].id) {
            setTimeout(() => {
              setIsDialogOpen(true);
            }, 2000);
          } else {
            handleNextChapter();
            toast({
              variant: 'success',
              title: tValidation('success-title'),
              description: tValidation(res.success),
            });
          }
        } else {
          toast({
            variant: 'destructive',
            title: tValidation('error-title'),
            description: tValidation(res.error),
          });
        }
      });
    }
  };

  const handleChapterClick = (chapter: ChapterWithCompletion) => {
    const currentIndex = newChapters.findIndex((c) => c.id === chapter.id);
    const previousChapter = newChapters[currentIndex - 1];

    if (currentIndex === 0 || previousChapter?.completed) {
      setCurrentChapter(chapter);
    } else {
      toast({
        variant: 'destructive',
        title: tValidation('error-title'),
        description: tValidation('previous-chapter-incomplete-error'),
      });
    }
  };

  const handlePreviousChapter = () => {
    const currentIndex = newChapters.findIndex((chapter) => chapter.id === currentChapter.id);
    const previousChapter = newChapters[currentIndex - 1];

    if (currentIndex === 0 || previousChapter?.completed) {
      if (currentIndex > 0) {
        setCurrentChapter(newChapters[currentIndex - 1]);
      }
    } else {
      toast({
        variant: 'destructive',
        title: tValidation('error-title'),
        description: tValidation('previous-chapter-incomplete-error'),
      });
    }
  };

  const handleNextChapter = () => {
    const currentIndex = newChapters.findIndex((chapter) => chapter.id === currentChapter.id);

    if (newChapters[currentIndex].completed) {
      if (currentIndex < newChapters.length - 1) {
        setCurrentChapter(newChapters[currentIndex + 1]);
      }
    } else {
      toast({
        variant: 'destructive',
        title: tValidation('error-title'),
        description: tValidation('previous-chapter-incomplete-error'),
      });
    }
  };

  return (
    <>
      <div className="flex h-full w-full flex-col space-x-0  space-y-6 rounded-lg border bg-background  p-5 md:flex-row md:space-x-6 md:space-y-0">
        <Image
          alt="Course Image"
          height={80}
          width={420}
          src={course?.image ? `${MEDIA_HOSTNAME}${course?.image}` : '/img/course.webp'}
        />
        <div className="flex flex-col justify-center space-y-4">
          <h1 className="text-xl font-semibold text-foreground">
            {locale === localeOptions.EN ? course?.title_en : course?.title_fr}
          </h1>
          <p className="text-sm text-foreground">{course?.description_fr}</p>
          <div className="flex flex-col space-y-4">
            <p className="text-sm font-semibold text-foreground">{t('hosted-by')} :</p>
            <div className="flex w-full flex-row items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/img/rached.webp" alt="Avatar" />
                <AvatarFallback className="text-lg">R</AvatarFallback>
              </Avatar>
              <p className="text-sm">Rached Khemakhem</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex max-h-[60rem] w-full flex-grow flex-col space-x-0 space-y-6 pt-2 md:max-h-[52rem]  md:flex-row md:space-x-6 md:space-y-0">
        <div
          className={cn(
            isMinimized ? 'gap-y-3' : 'gap-y-6',
            'flex w-full flex-col justify-between rounded-lg border bg-background p-5 md:w-[70%]',
          )}>
          <div className="flex flex-row items-center justify-between">
            <h1 className="text-xl font-medium">
              {t('chapter')} {currentChapter ? currentChapter.position : 1}
            </h1>
            <Button
              onClick={handleChapterCompleted}
              size={'sm'}
              variant={'success'}
              disabled={currentChapter ? currentChapter?.completed : false}>
              {isLoading ? (
                <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <IconCheck className="mr-2 h-5 w-5" />
              )}
              {t('complete-button')}
            </Button>
          </div>
          <div className="mx-auto aspect-video h-auto w-full">
            {isLoading ? (
              <Skeleton className="aspect-video" />
            ) : (
              <ReactPlayer
                controls
                config={{
                  file: {
                    attributes: {
                      controlsList: 'nodownload',
                    },
                  },
                }}
                url={`${MEDIA_HOSTNAME}${currentChapter?.video}`}
                width="100%"
                height="100%"
              />
            )}
          </div>

          <div>
            <h1 className="text-lg font-medium">
              {locale === localeOptions.EN
                ? t('chapter') + ' ' + currentChapter?.position + ' : ' + currentChapter?.title_en
                : t('chapter') + ' ' + currentChapter?.position + ' : ' + currentChapter?.title_fr}
            </h1>

            <div
              className={cn(
                isMinimized ? 'max-h-[5.5rem]' : 'max-h-[7.5rem]',
                'custom-scrollbar my-2 mt-3 cursor-pointer overflow-y-auto rounded-md border bg-page p-2',
              )}>
              <div>
                {isDescriptionLoading ? (
                  <div className="flex h-full w-full flex-col gap-y-3 bg-page">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-3" />
                    <Skeleton className="h-3" />
                    <Skeleton className="h-3" />
                  </div>
                ) : locale === localeOptions.EN ? (
                  <TextPreview value={currentChapter?.description_en} />
                ) : (
                  <TextPreview value={currentChapter?.description_fr} />
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between">
            <Button
              size={'sm'}
              variant={'primary'}
              onClick={handlePreviousChapter}
              disabled={currentChapter ? currentChapter.id === newChapters[0].id : false}>
              <IconChevronsLeft className="mr-1 h-5 w-5" />
              {t('previous-button')}
            </Button>
            <Button
              size={'sm'}
              variant={'primary'}
              onClick={handleNextChapter}
              disabled={currentChapter ? currentChapter.id === newChapters[newChapters.length - 1].id : false}>
              {t('next-button')}
              <IconChevronsRight className="ml-1 h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="custom-scrollbar flex h-auto w-full cursor-pointer flex-col overflow-y-auto rounded-lg border bg-background md:w-[30%]">
          <h1 className="p-5 text-lg font-medium">{t('chapters')}</h1>
          {newChapters.map((chapter: Chapter & { completed?: boolean }) => (
            <div
              onClick={() => handleChapterClick(chapter)}
              className={cn(
                currentChapter?.id === chapter.id ? 'bg-muted' : '',
                'flex flex-row items-center  space-x-4 p-5 hover:bg-muted',
              )}
              key={chapter.id}>
              <div className="relative h-full w-1/2 ">
                <div className="absolute left-0 top-0 flex items-center justify-center">
                  <div className="flex h-[85px] w-[150px] flex-col items-center justify-center  bg-gray-500 bg-opacity-30 text-3xl font-bold text-white">
                    <IconPlayerPlayFilled />
                  </div>
                </div>
                <Image
                  height={85}
                  className="h-[85px] w-[150px]"
                  width={150}
                  src={'/img/chapter.webp'}
                  alt={'Chapter Image'}
                />
              </div>

              <div className="flex w-1/2 flex-col items-start justify-center space-y-1">
                <h2 className="text-sm font-medium">
                  {t('chapter')} {chapter.position}
                </h2>
                <p className="text-xs font-normal text-muted-foreground">
                  {locale === localeOptions.EN ? chapter.title_en : chapter.title_fr}
                </p>
                {chapter.completed && (
                  <p className="flex flex-row items-center justify-start text-xs font-normal text-success">
                    {t('completed')}
                    <IconCircleCheckFilled className="ml-2 h-4 w-4 pl-0" />
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <CourseCompleteDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  );
}
