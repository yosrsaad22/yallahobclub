'use client';
import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTranslations } from 'next-intl';

export function DatePicker({
  selectedDate,
  onDateChange,
}: {
  selectedDate?: Date;
  onDateChange: (date: Date | undefined) => void;
}) {
  const [date, setDate] = React.useState<Date | undefined>(selectedDate);
  const t = useTranslations('dashboard.text');

  React.useEffect(() => {
    setDate(selectedDate); // Ensure the state reflects the prop value
  }, [selectedDate]);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    onDateChange(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('flex h-11 w-full justify-start p-3 text-left font-normal', !date && 'text-muted-foreground')}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, 'dd/MM/yyyy')
          ) : (
            <span className="max-w-[90%] truncate">{t('date-picker-placeholder')}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" className="flex w-auto flex-col space-y-2 bg-background p-2">
        <div className="rounded-md border">
          <Calendar showOutsideDays={false} mode="single" selected={date} onSelect={handleDateSelect} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
