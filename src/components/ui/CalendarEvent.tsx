
import { CalendarEvent } from '@/utils/calendarHelpers';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CalendarEventItemProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  isCompact?: boolean;
  showTime?: boolean;
}

export function CalendarEventItem({ event, onClick, isCompact = false, showTime = false }: CalendarEventItemProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <div
      className={cn(
        'rounded-md border px-2 py-1 text-xs font-medium cursor-pointer transition-all hover:opacity-80',
        isCompact ? 'truncate text-[10px] py-0.5' : 'space-y-1',
        event.color || 'bg-blue-100 text-blue-600 border-blue-200'
      )}
      onClick={handleClick}
    >
      <div className={isCompact ? 'truncate' : 'font-semibold'}>
        {event.title}
      </div>
      
      {!isCompact && event.location && (
        <div className="text-xs opacity-80">{event.location}</div>
      )}
      
      {showTime && (
        <div className="text-xs opacity-80">
          {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
        </div>
      )}
    </div>
  );
}

export default CalendarEventItem;
