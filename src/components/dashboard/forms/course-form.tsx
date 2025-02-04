'use client';

import * as React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import z from 'zod';
import { CourseSchema } from '@/schemas';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { IconDeviceFloppy, IconLoader2, IconPlus } from '@tabler/icons-react';
import { Chapter, Course } from '@prisma/client';
import { toast } from '@/components/ui/use-toast';
import { LabelInputContainer } from '@/components/ui/label-input-container';
import Image from 'next/image';
import { UploadButton } from '@/lib/uploadthing';
import { MEDIA_HOSTNAME } from '@/lib/constants';
import { useRouter } from '@/navigation';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { ActionResponse } from '@/types';
import { AddChapterDialog } from '../dialogs/add-chapter-dialog';
import { cn } from '@/lib/utils';
import { editCourse } from '@/actions/course';
import { Textarea } from '@/components/ui/textarea';
import ChapterCard from '../cards/chapter-card';

interface CourseFormProps extends React.HTMLAttributes<HTMLDivElement> {
  courseData: Course | null;
  chaptersData: Chapter[] | null;
  onChapterAdd: (data: any) => Promise<ActionResponse>;
  onChapterEdit: (data: any) => Promise<ActionResponse>;
  onChapterDelete: (id: string) => Promise<ActionResponse>;
}
export function CourseForm({
  className,
  courseData,
  chaptersData,
  onChapterAdd,
  onChapterEdit,
  onChapterDelete,
}: CourseFormProps) {
  const [isLoading, startTransition] = React.useTransition();
  const [chapters, setChapters] = React.useState(chaptersData || []);
  const [open, setOpen] = React.useState(false);
  const t = useTranslations('dashboard.course');
  const tFields = useTranslations('fields');
  const tValidation = useTranslations('validation');
  const router = useRouter();

  type schemaType = z.infer<typeof CourseSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<schemaType>({ resolver: zodResolver(CourseSchema) });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setChapters((prevChapters) => {
        const oldIndex = prevChapters.findIndex((chapter) => chapter.id === active.id);
        const newIndex = prevChapters.findIndex((chapter) => chapter.id === over?.id);
        const newChapters = arrayMove(prevChapters, oldIndex, newIndex).map((chapter, index) => ({
          ...chapter,
          position: index + 1,
        }));
        return newChapters;
      });
    }
  };

  const handleChapterAdd = async (newChapter: any): Promise<ActionResponse> => {
    const res = await onChapterAdd(newChapter);
    if (res.success) {
      setChapters((prevChapters) => [...prevChapters, res.data]);
      toast({
        variant: 'success',
        title: tValidation('success-title'),
        description: tValidation(res.success),
      });
    } else {
      toast({
        variant: 'destructive',
        title: tValidation('error-title'),
        description: tValidation(res.error),
      });
    }
    return res;
  };

  const handleChapterEdit = async (data: any): Promise<ActionResponse> => {
    const res = await onChapterEdit(data);
    if (res.success) {
      setChapters((prevChapters) =>
        prevChapters.map((chapter) => (chapter.id === data.id ? { ...chapter, ...data } : chapter)),
      );
      toast({
        variant: 'success',
        title: tValidation('success-title'),
        description: tValidation(res.success),
      });
    } else {
      toast({
        variant: 'destructive',
        title: tValidation('error-title'),
        description: tValidation(res.error),
      });
    }
    return res;
  };

  const handleChapterDelete = async (id: string) => {
    const res = await onChapterDelete(id);
    if (res.success) {
      setChapters((prevChapters) => {
        const updatedChapters = prevChapters.filter((chapter) => chapter.id !== id);
        return updatedChapters.map((chapter, index) => ({
          ...chapter,
          position: index + 1,
        }));
      });
      toast({
        variant: 'success',
        title: tValidation('success-title'),
        description: tValidation(res.success),
      });
    } else {
      toast({
        variant: 'destructive',
        title: tValidation('error-title'),
        description: tValidation(res.error),
      });
    }
    return res;
  };

  const onSubmit: SubmitHandler<schemaType> = async (data, event: React.BaseSyntheticEvent | undefined) => {
    event?.preventDefault();
    startTransition(() => {
      editCourse(data, chapters).then((res: ActionResponse) => {
        if (res.success) {
          toast({
            variant: 'success',
            title: tValidation('success-title'),
            description: tValidation(res.success),
          });
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
    <>
      <AddChapterDialog
        position={chapters.length + 1}
        isOpen={open}
        onClose={() => setOpen(false)}
        onChapterAdd={handleChapterAdd}
      />
      <div className="flex h-full w-full flex-col items-center pt-2">
        <div className="flex w-full flex-col space-x-0 space-y-6">
          <div className="flex flex-col space-x-0 space-y-6 lg:flex-row lg:space-x-6 lg:space-y-0">
            <div className="flex w-full flex-col space-y-6">
              {/* Title  */}
              <div className="w-full space-y-12  rounded-lg border bg-background p-6">
                <div className="space-y-2">
                  <h2 className="pb-4 text-lg font-semibold">{t('title')}</h2>
                  <div className="grid grid-cols-1 gap-6">
                    <LabelInputContainer>
                      <Label htmlFor="title_en">{tFields('course-title-en')}</Label>
                      <Input
                        {...register('title_en')}
                        id="title_en"
                        disabled={isLoading}
                        defaultValue={courseData?.title_en ?? ''}
                        placeholder={tFields('course-title-en')}
                        type="text"
                      />
                      {errors.title_en && (
                        <span className="text-xs text-red-400">{tValidation('course-title-error')}</span>
                      )}
                    </LabelInputContainer>
                    <LabelInputContainer>
                      <Label htmlFor="title_fr">{tFields('course-title-fr')}</Label>
                      <Input
                        {...register('title_fr')}
                        id="title_fr"
                        disabled={isLoading}
                        defaultValue={courseData?.title_fr ?? ''}
                        placeholder={tFields('course-title-fr')}
                        type="text"
                      />
                      {errors.title_fr && (
                        <span className="text-xs text-red-400">{tValidation('course-title-error')}</span>
                      )}
                    </LabelInputContainer>
                  </div>
                </div>
              </div>
              {/* description  */}
              <div className="w-full space-y-12  rounded-lg border bg-background p-6">
                <div className="space-y-2">
                  <h2 className="pb-4 text-lg font-semibold">{t('description')}</h2>
                  <div className="grid grid-cols-1 gap-6">
                    <LabelInputContainer>
                      <Label htmlFor="description_en">{tFields('course-description-en')}</Label>
                      <Textarea
                        className="h-[10rem]"
                        {...register('description_en')}
                        id="description_en"
                        disabled={isLoading}
                        defaultValue={courseData?.description_en ?? ''}
                        placeholder={tFields('course-description-en')}
                      />
                      {errors.description_en && (
                        <span className="text-xs text-red-400">{tValidation('course-description-error')}</span>
                      )}
                    </LabelInputContainer>
                    <LabelInputContainer>
                      <Label htmlFor="description_fr">{tFields('course-description-fr')}</Label>
                      <Textarea
                        {...register('description_fr')}
                        className="h-[10rem] "
                        id="description_fr"
                        disabled={isLoading}
                        defaultValue={courseData?.description_fr ?? ''}
                        placeholder={tFields('course-description-fr')}
                      />
                      {errors.description_fr && (
                        <span className="text-xs text-red-400">{tValidation('course-description-error')}</span>
                      )}
                    </LabelInputContainer>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col space-y-6">
              {/* Image */}
              <div className="  rounded-lg border bg-background p-6">
                <h2 className="text-lg font-semibold">{t('image')}</h2>
                <div className="flex h-[200px] w-auto flex-row items-center justify-center">
                  <Image
                    src={courseData?.image ? `${MEDIA_HOSTNAME}${courseData?.image}` : '/img/course.webp'}
                    className="object-contain"
                    width={300}
                    height={90}
                    alt={'Course Image'}
                  />
                </div>
                <UploadButton
                  className={`flex flex-col items-center justify-center gap-1 text-sm ut-button:h-11 ut-button:rounded-md ut-button:border-none ut-button:bg-foreground ut-button:font-semibold ut-button:text-background ut-button:ring-offset-background ut-button:focus-within:bg-foreground ut-button:hover:bg-foreground/80 ut-button:focus:bg-foreground ut-button:focus-visible:outline-none ut-button:focus-visible:ring-2 ut-button:focus-visible:ring-ring ut-button:focus-visible:ring-offset-2 ut-button:active:bg-foreground ${className}`}
                  appearance={{
                    button:
                      'focus-within:ring-foreground ut-ready:bg-foreground ut-uploading:cursor-not-allowed after:bg-foreground',
                  }}
                  content={{
                    button({ ready, isUploading }) {
                      if (isUploading) return <IconLoader2 className="z-[5] h-5 w-5 animate-spin" />;
                      if (!ready) return <IconLoader2 className="z-[5] h-5 w-5 animate-spin" />;

                      return <div> {t('image-button')}</div>;
                    },
                  }}
                  endpoint="courseImage"
                  onClientUploadComplete={(res) => {
                    router.refresh();
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
              {/* Chapters */}
              <div
                className={cn(
                  chaptersData && chaptersData.length > 0 ? 'overflow-auto' : 'overflow-hidden',
                  'custom-scrollbar max-h-[24.7rem] w-full rounded-lg border bg-background p-6',
                )}>
                <div className="flex flex-row items-center justify-between">
                  <h2 className="text-lg font-semibold">{t('chapters')}</h2>
                  {chaptersData && chaptersData.length > 0 && (
                    <Button onClick={() => setOpen(true)}>
                      <IconPlus className="mr-2 h-5 w-5" /> {t('add')}
                    </Button>
                  )}
                </div>
                {chaptersData?.length === 0 && (
                  <div className="flex h-full w-full flex-col items-center justify-center space-y-6 py-6">
                    <p className="text-sm text-muted-foreground">{t('no-result')} </p>
                    <Button onClick={() => setOpen(true)}>
                      <IconPlus className="mr-2 h-5 w-5" />
                      {t('add')}
                    </Button>
                  </div>
                )}
                {chapters && chapters.length > 0 && (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
                    <SortableContext items={chapters} strategy={verticalListSortingStrategy}>
                      <div className="space-y-3 py-6">
                        {chapters.map((item: Chapter) => (
                          <ChapterCard
                            key={item.id}
                            chapter={item}
                            onDelete={handleChapterDelete}
                            onEdit={handleChapterEdit}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-[25rem] justify-center pb-8 pt-10">
          <Button onClick={handleSubmit(onSubmit)} className="h-12" disabled={isLoading}>
            {isLoading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
            {!isLoading && <IconDeviceFloppy className="mr-2 h-5 w-5 " />}
            {t('save-button')}
          </Button>
        </div>
      </div>
    </>
  );
}
