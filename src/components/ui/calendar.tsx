import * as React from 'react';

import {format, addMonths, subMonths} from 'date-fns';
import {ru} from 'date-fns/locale';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {DayPicker} from 'react-day-picker';

import {buttonVariants} from '@/components/ui/button';
import {cn} from '@/lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [month, setMonth] = React.useState(props.month || new Date());
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={ru}
      month={month}
      onMonthChange={setMonth}
      className={cn('w-full', className)} 
      classNames={{
        months: 'flex flex-col sm:flex-row gap-4 w-full',
        month: 'space-y-3 flex-1 w-full',
        caption: 'flex justify-between items-center pt-1.5 relative text-lg w-full font-normal gap-x-2',
        caption_label: 'text-base font-normal w-full text-center',
        nav: 'flex items-center w-full',
        nav_button: cn(
          buttonVariants({variant: 'outline'}),
          'h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 text-base focus:bg-green-100 focus:text-green-800 active:bg-green-200 active:text-green-900 aria-selected:bg-green-600 aria-selected:text-white'
        ),
        nav_button_previous: '',
        nav_button_next: '',
        table: 'w-full border-collapse gap-y-1.5',
        head_row: 'flex w-full',
        head_cell: 'text-muted-foreground rounded-md flex-1 min-w-0 text-base text-center font-normal',
        row: 'flex w-full mt-2.5',
        cell: 'flex-1 min-w-0 aspect-square text-center text-base p-0 relative items-center justify-center flex [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-green-100/50 [&:has([aria-selected])]:bg-green-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({variant: 'ghost'}),
          'w-full h-full p-0 aria-selected:opacity-100 text-base flex items-center justify-center font-normal'
        ),
        day_range_end: 'day-range-end',
        day_selected:
          'bg-green-600 text-white hover:bg-green-700 hover:text-white focus:bg-green-700 focus:text-white',
        day_today: 'bg-green-200 text-green-800 border border-green-600',
        day_outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-green-100/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-green-200 aria-selected:text-green-900',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Caption: (captionProps: any) => (
          <CustomCaption
            {...captionProps}
            setMonth={setMonth}
          />
        ),
        IconLeft: ({..._props}) => <ChevronLeft className="h-5 w-5"/>,
        IconRight: ({..._props}) => <ChevronRight className="h-5 w-5"/>,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

// Custom Caption component for DayPicker
function CustomCaption(props: any) {
  const { displayMonth, setMonth, locale } = props;
  return (
    <div className="flex items-center justify-between w-full gap-2 pt-1.5 text-lg font-normal">
      <button
        type="button"
        onClick={() => setMonth(subMonths(displayMonth, 1))}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 text-base focus:bg-green-100 focus:text-green-800 active:bg-green-200 active:text-green-900 aria-selected:bg-green-600 aria-selected:text-white'
        )}
        aria-label="Previous month"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <span className="text-base font-normal w-full text-center select-none">
        {format(displayMonth, 'LLLL yyyy', { locale: ru })}
      </span>
      <button
        type="button"
        onClick={() => setMonth(addMonths(displayMonth, 1))}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 text-base focus:bg-green-100 focus:text-green-800 active:bg-green-200 active:text-green-900 aria-selected:bg-green-600 aria-selected:text-white'
        )}
        aria-label="Next month"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

export {Calendar};
