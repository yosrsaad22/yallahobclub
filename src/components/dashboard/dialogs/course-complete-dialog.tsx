'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useTranslations } from 'next-intl';

interface CourseCompleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CourseCompleteDialog: React.FC<CourseCompleteDialogProps> = ({ isOpen, onClose }) => {
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations('dashboard');
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog
      title={t('dialogs.course-complete-title')}
      description={t('dialogs.course-complete-text')}
      isOpen={isOpen}
      onClose={onClose}>
      <div className="flex w-full items-center justify-center space-x-2 md:justify-end">
        <Button onClick={onClose}>{t('dialogs.close')}</Button>
      </div>
    </Dialog>
  );
};
