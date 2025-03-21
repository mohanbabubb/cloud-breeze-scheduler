
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CalendarEvent } from '@/utils/calendarHelpers';
import { format } from 'date-fns';

interface CalendarEventProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  className?: string;
  isCompact?: boolean;
}

export function CalendarEventItem({ 
  event, 
  onClick, 
  className,
  isCompact = false
}: CalendarEventProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    if (onClick) {
      onClick(event);
    }
  };
  
  // Derive color classes from event color or use default
  const colorClass = event.color || 'bg-blue-100 text-blue-600 border-blue-200';
  
  return (
    <div
      className={cn(
        "group px-2 py-1 rounded-md text-sm border transition-all duration-200",
        isCompact ? "truncate" : "mb-1",
        colorClass,
        isHovered ? "shadow-sm translate-y-[-1px]" : "",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {!isCompact && (
        <div className="text-xs font-medium opacity-80 mb-0.5">
          {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
        </div>
      )}
      <div className={cn(
        "font-medium", 
        isCompact ? "truncate text-xs" : ""
      )}>
        {event.title}
      </div>
      {!isCompact && event.location && (
        <div className="text-xs mt-1 opacity-80 truncate">
          {event.location}
        </div>
      )}
    </div>
  );
}

export default CalendarEventItem;
