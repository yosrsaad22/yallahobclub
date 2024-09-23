import React, { FC, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Chapter } from '@prisma/client';
import { IconEdit, IconGripVertical, IconTrash } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocale, useTranslations } from 'next-intl';
import { MEDIA_HOSTNAME, localeOptions } from '@/lib/constants';
import { DeleteDialog } from '../dialogs/delete-dialog';
import { EditChapterDialog } from '../dialogs/edit-chapter-dialog';
import { ActionResponse } from '@/types';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface ChapterCardProps {
  chapter: Chapter;
  onDelete: (id: string) => void;
  onEdit: (data: Chapter) => Promise<ActionResponse>;
}

const ChapterCard: FC<ChapterCardProps> = ({ chapter, onEdit, onDelete }) => {
  const id = chapter.id;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isLoading, startTransition] = React.useTransition();
  const [isVideoReady, setIsVideoReady] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });
  const locale = useLocale();
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCursorGrabbing = attributes['aria-pressed'];

  const onDeleteConfirm = async () => {
    startTransition(() => {
      onDelete(id);
      setDeleteDialogOpen(false);
    });
  };

  const onEditConfirm = (data: Chapter): Promise<ActionResponse> => {
    return onEdit(data);
  };

  return (
    <>
      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={onDeleteConfirm}
        isLoading={isLoading}
      />
      <EditChapterDialog
        chapter={chapter}
        onChapterEdit={onEditConfirm}
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
      />

      <div ref={setNodeRef} style={style} key={id}>
        <div className="relative flex h-min w-full flex-row items-center justify-between gap-0 rounded-md border bg-background px-2 py-0 md:gap-3 md:py-2">
          <Badge
            variant={'primary'}
            className="absolute -right-2 -top-2 h-6 w-6 rounded-full px-2 py-1 text-sm text-white">
            {chapter.position}
          </Badge>
          <div className="flex h-16 w-48 flex-row items-center justify-start gap-x-4 sm:w-2/3 md:w-72">
            <Button
              size={'icon'}
              variant={'ghost'}
              {...attributes}
              {...listeners}
              className={`w-8 ${isCursorGrabbing ? 'cursor-grabbing' : 'cursor-grab'}`}
              aria-describedby={`DndContext-${id}`}>
              <IconGripVertical className="h-5 w-5 text-muted-foreground" />
            </Button>
            <div className="aspect-video w-56 md:w-56">
              {!isVideoReady && <Skeleton className="h-full w-full" />}
              <div className={!isVideoReady ? 'hidden' : ''}>
                <ReactPlayer
                  controls={false}
                  url={`${MEDIA_HOSTNAME}${chapter.video}`}
                  width={'100%'}
                  height={'100%'}
                  onReady={() => {
                    setIsVideoReady(true);
                  }}
                />
              </div>
            </div>

            {locale === localeOptions.EN && (
              <div className="flex w-full text-left text-xs md:text-sm">{chapter.title_en}</div>
            )}
            {locale === localeOptions.FR && (
              <div className="flex w-full text-left text-xs md:text-sm">{chapter.title_fr}</div>
            )}
          </div>

          <div className="flex w-14 flex-col items-end justify-center gap-x-0 md:flex-row md:gap-x-2">
            <Button size={'icon'} variant={'ghost'} onClick={() => setEditDialogOpen(true)}>
              <IconEdit className="h-5 w-5" />
            </Button>
            <Button size={'icon'} variant={'ghost'} onClick={() => setDeleteDialogOpen(true)}>
              <IconTrash className="h-5 w-5 text-destructive" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterCard;
