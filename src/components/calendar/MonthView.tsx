
import { useState, useRef, useEffect } from 'react';
import { format, isSameMonth, isToday, isSameDay } from 'date-fns';
import { CalendarEvent, getMonthDates, getEventsForDay } from '@/utils/calendarHelpers';
import { CalendarEventItem } from '@/components/ui/CalendarEvent';
import { cn } from '@/lib/utils';
import { getTransitionClasses } from '@/utils/animations';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
  transitionState?: 'from' | 'to';
}

export function MonthView({
  currentDate,
  events,
  onDateClick,
  onEventClick,
  className,
  transitionState = 'to'
}: MonthViewProps) {
  const [monthDays, setMonthDays] = useState<Date[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setMonthDays(getMonthDates(currentDate));
  }, [currentDate]);
  
  const handleDateClick = (date: Date) => {
    if (onDateClick) {
      onDateClick(date);
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className={cn(
        'grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden',
        getTransitionClasses(transitionState, 'fade'),
        className
      )}
    >
      {/* Day headers */}
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <div 
          key={day} 
          className="bg-secondary/80 p-2 text-center text-xs font-medium text-muted-foreground"
        >
          {day}
        </div>
      ))}
      
      {/* Calendar days */}
      {monthDays.map((day, index) => {
        const isCurrentMonth = isSameMonth(day, currentDate);
        const isCurrentDay = isToday(day);
        const dayEvents = getEventsForDay(events, day);
        
        return (
          <div
            key={index}
            onClick={() => handleDateClick(day)}
            className={cn(
              "bg-card relative p-1 min-h-[100px] transition-colors border-0",
              isCurrentMonth ? "text-foreground" : "text-muted-foreground/60",
              !isCurrentMonth && "bg-card/60"
            )}
          >
            <div className="flex justify-between items-start p-1">
              <div 
                className={cn(
                  "flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full",
                  isCurrentDay && "bg-primary text-primary-foreground"
                )}
              >
                {format(day, 'd')}
              </div>
            </div>
            <div className="mt-1 space-y-1 max-h-[80px] overflow-hidden">
              {dayEvents.slice(0, 3).map((event) => (
                <CalendarEventItem
                  key={event.id}
                  event={event}
                  onClick={onEventClick}
                  isCompact
                />
              ))}
              {dayEvents.length > 3 && (
                <div className="text-xs px-2 font-medium text-muted-foreground">
                  +{dayEvents.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MonthView;
