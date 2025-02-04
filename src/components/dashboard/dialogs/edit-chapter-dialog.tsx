'use client';
import { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';
import { IconDeviceFloppy, IconLoader2 } from '@tabler/icons-react';
import z from 'zod';
import { ChapterSchema } from '@/schemas';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LabelInputContainer } from '@/components/ui/label-input-container';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Chapter } from '@prisma/client';
import ReactPlayer from 'react-player';
import { MEDIA_HOSTNAME } from '@/lib/constants';
import { UploadButton } from '@/lib/uploadthing';
import { toast } from '@/components/ui/use-toast';
import { ActionResponse } from '@/types';
import { deleteVideo } from '@/actions/course';
import { TextEditor } from '@/components/ui/text-editor';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface EditChapterDialogProps {
  chapter: Chapter;
  onChapterEdit: (data: any) => Promise<ActionResponse>;
  isOpen: boolean;
  onClose: () => void;
}

export const EditChapterDialog: React.FC<EditChapterDialogProps> = ({ chapter, onChapterEdit, isOpen, onClose }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, startTransition] = useTransition();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [video, setVideo] = useState<string>(chapter.video);
  const [isUploading, setIsUploading] = useState(false);
  const [isVideoUploaded, setIsVideoUploaded] = useState(false);
  const [descriptionEN, setDescriptionEn] = useState<string>(chapter.description_en);
  const [descriptionFR, setDescriptionFr] = useState<string>(chapter.description_fr);
  const [isVideoReady, setIsVideoReady] = useState(false); // State for video readiness

  const t = useTranslations('dashboard.course');
  const tFields = useTranslations('fields');
  const tValidation = useTranslations('validation');

  type schemaType = z.infer<typeof ChapterSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setValue,
    getValues,
  } = useForm<schemaType>({
    resolver: zodResolver(ChapterSchema),
  });

  setValue('video', chapter.video);
  setValue('description_en', descriptionEN);
  setValue('description_fr', descriptionFR);

  const onSubmit: SubmitHandler<schemaType> = async (data, event) => {
    event?.preventDefault();
    startTransition(async () => {
      const id = chapter.id;
      data.video = video;
      const newChapter = { ...data, id };
      await onChapterEdit(newChapter);
      handleClose();
    });
  };

  const handleClose = async () => {
    if (isUploading) return null;
    if (!isFormSubmitted && isVideoUploaded) {
      await deleteVideo(getValues('video'));
    }
    setIsVideoUploaded(false);
    reset();
    clearErrors();
    onClose();
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog title={t('edit-chapter-title')} isOpen={isOpen} onClose={() => handleClose()}>
      <div className="flex h-full w-full flex-col items-center overflow-y-auto overflow-x-hidden py-2 pt-6">
        <form className="w-full space-y-6 p-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex w-full flex-col space-x-0 space-y-6 p-0">
            <div className="flex w-full flex-col items-center justify-center  space-y-3">
              <div className="flex w-full flex-col items-start justify-start text-left">
                <Label htmlFor="video">{tFields('chapter-video')}</Label>
              </div>
              <div className="aspect-video h-full w-full">
                <div className={cn(!isVideoReady ? 'hidden' : '')}>
                  <ReactPlayer
                    controls
                    height={'100%'}
                    width={'100%'}
                    url={`${MEDIA_HOSTNAME}${video}`}
                    onReady={() => setIsVideoReady(true)}
                  />
                </div>
                {!isVideoReady && <Skeleton className="aspect-video h-full w-full" />}
              </div>
              {errors.video && <span className="text-xs text-red-400">{tValidation('chapter-video-error')}</span>}
              {!isVideoUploaded && (
                <UploadButton
                  className={`flex flex-col items-center justify-center gap-1 pt-2 text-sm ut-button:h-11 ut-button:rounded-md ut-button:border-none ut-button:bg-foreground ut-button:font-semibold ut-button:text-background ut-button:ring-offset-background ut-button:focus-within:bg-foreground ut-button:hover:bg-foreground/80 ut-button:focus:bg-foreground ut-button:focus-visible:outline-none ut-button:focus-visible:ring-2 ut-button:focus-visible:ring-ring ut-button:focus-visible:ring-offset-2 ut-button:active:bg-foreground ut-uploading:pointer-events-none`}
                  appearance={{
                    button:
                      'focus-within:ring-foreground ut-ready:bg-foreground ut-uploading:cursor-not-allowed after:bg-foreground',
                    allowedContent: 'text-secondary',
                  }}
                  content={{
                    button({ ready, isUploading, uploadProgress }) {
                      if (isUploading)
                        return (
                          <div className="z-[5] flex flex-row">
                            <IconLoader2 className="z-[5] mr-2 h-5 w-5 animate-spin" />
                            {uploadProgress} %
                          </div>
                        );
                      if (!ready) return <IconLoader2 className="z-[5] h-5 w-5 animate-spin" />;

                      return <div>{t('change-video-button')}</div>;
                    },
                  }}
                  endpoint="chapterVideo"
                  onUploadBegin={() => {
                    setIsUploading(true);
                  }}
                  onClientUploadComplete={(res) => {
                    setVideo(res[0]?.key);
                    setValue('video', res[0]?.key);
                    setIsUploading(false);
                    setIsVideoUploaded(true);
                    setIsVideoReady(false); // Reset video readiness
                    toast({
                      variant: 'success',
                      title: tValidation('success-title'),
                      description: tValidation('video-upload-success'),
                    });
                  }}
                  onUploadError={(error: Error) => {
                    setIsUploading(false);
                    toast({
                      variant: 'destructive',
                      title: tValidation('error-title'),
                      description: tValidation('video-upload-error'),
                    });
                  }}
                />
              )}
            </div>
            <div className="flex w-full flex-col items-start justify-start space-x-0">
              <div className="w-full space-y-6">
                <div>
                  <div className="grid grid-cols-1 gap-6">
                    <LabelInputContainer>
                      <Label htmlFor="title_en">{tFields('chapter-title-en')}</Label>
                      <Input
                        {...register('title_en')}
                        id="title_en"
                        defaultValue={chapter.title_en}
                        disabled={isLoading}
                        placeholder={tFields('chapter-title-en')}
                        type="text"
                      />
                      {errors.title_en && (
                        <span className="text-xs text-red-400">{tValidation('chapter-title-error')}</span>
                      )}
                    </LabelInputContainer>
                    <LabelInputContainer>
                      <Label htmlFor="title_fr">{tFields('chapter-title-fr')}</Label>
                      <Input
                        {...register('title_fr')}
                        id="title_fr"
                        defaultValue={chapter.title_fr}
                        disabled={isLoading}
                        placeholder={tFields('chapter-title-fr')}
                        type="text"
                      />
                      {errors.title_fr && (
                        <span className="text-xs text-red-400">{tValidation('chapter-title-error')}</span>
                      )}
                    </LabelInputContainer>
                    <LabelInputContainer>
                      <Label htmlFor="description_en">{tFields('chapter-description-en')}</Label>

                      <TextEditor
                        value={descriptionEN}
                        disabled={isLoading}
                        onChange={(value) => {
                          setDescriptionEn(value);
                          setValue('description_en', value);
                        }}
                      />

                      {errors.description_en && (
                        <span className="text-xs text-red-400">{tValidation('chapter-description-error')}</span>
                      )}
                    </LabelInputContainer>
                    <LabelInputContainer>
                      <Label htmlFor="description_fr">{tFields('chapter-description-fr')}</Label>
                      <TextEditor
                        value={descriptionFR}
                        disabled={isLoading}
                        onChange={(value) => {
                          setDescriptionFr(value);
                          setValue('description_fr', value);
                        }}
                      />

                      {errors.description_fr && (
                        <span className="text-xs text-red-400">{tValidation('chapter-description-error')}</span>
                      )}
                    </LabelInputContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-center space-x-2 pt-4">
            <Button
              onClick={() => {
                setIsFormSubmitted(true);
              }}
              type="submit"
              size="default"
              disabled={isLoading || isUploading}>
              {isLoading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
              {!isLoading && <IconDeviceFloppy className="mr-2 h-5 w-5 " />}
              {t('save-button')}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
};
