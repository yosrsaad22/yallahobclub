import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { IconCalendar } from '@tabler/icons-react';
import { addDays, format } from 'date-fns';
import { DateRange } from '@/types';

export function DateRangePicker({ className, onChange }: { className?: string; onChange: (range: DateRange) => void }) {
  const [date, setDate] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  });

  useEffect(() => {
    if (onChange) {
      onChange(date);
    }
  }, [date, onChange]);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn('justify-start px-3 text-left font-medium', !date.from && 'text-muted-foreground')}>
            <IconCalendar className="mr-2 h-5 w-5" />
            {date.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto bg-background p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date.from || undefined}
            selected={{
              from: date.from || undefined,
              to: date.to || undefined,
            }}
            onSelect={(selected) =>
              setDate({
                from: selected?.from || null,
                to: selected?.to || null,
              })
            }
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
