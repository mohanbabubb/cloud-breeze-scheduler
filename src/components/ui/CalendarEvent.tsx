
import { CalendarEvent } from '@/utils/calendarHelpers';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CalendarEventItemProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  isCompact?: boolean;
  showTime?: boolean;
  isDraggable?: boolean;
  onDragStart?: (event: React.DragEvent, calendarEvent: CalendarEvent) => void;
}

export function CalendarEventItem({ 
  event, 
  onClick, 
  isCompact = false, 
  showTime = false,
  isDraggable = false,
  onDragStart
}: CalendarEventItemProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(event);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (onDragStart) {
      e.dataTransfer.setData('application/json', JSON.stringify(event));
      onDragStart(e, event);
    }
  };

  return (
    <div
      className={cn(
        'rounded-md border px-2 py-1 text-xs font-medium transition-all hover:opacity-80',
        isCompact ? 'truncate text-[10px] py-0.5' : 'space-y-1',
        event.color || 'bg-blue-100 text-blue-600 border-blue-200',
        isDraggable && 'cursor-grab active:cursor-grabbing'
      )}
      onClick={handleClick}
      draggable={isDraggable}
      onDragStart={isDraggable ? handleDragStart : undefined}
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
