
import { useState, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import { CalendarEvent } from '@/utils/calendarHelpers';
import { CalendarEventItem } from '@/components/ui/CalendarEvent';
import { cn } from '@/lib/utils';
import { getTransitionClasses } from '@/utils/animations';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
  transitionState?: 'from' | 'to';
}

export function DayView({
  currentDate,
  events,
  onEventClick,
  className,
  transitionState = 'to'
}: DayViewProps) {
  const [dayEvents, setDayEvents] = useState<CalendarEvent[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  
  // Filter events for the current day
  useEffect(() => {
    const filteredEvents = events.filter(event => 
      isSameDay(event.start, currentDate)
    );
    
    // Sort events by start time
    filteredEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
    setDayEvents(filteredEvents);
    
    // Generate time slots for the day (24 hours)
    const slots = [];
    for (let i = 0; i < 24; i++) {
      slots.push(`${i.toString().padStart(2, '0')}:00`);
    }
    setTimeSlots(slots);
  }, [currentDate, events]);
  
  return (
    <div 
      className={cn(
        'bg-card rounded-lg overflow-hidden',
        getTransitionClasses(transitionState, 'fade'),
        className
      )}
    >
      <div className="p-4 bg-secondary/80 border-b">
        <h2 className="text-xl font-semibold">
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
        </h2>
      </div>
      
      <div className="flex h-[600px] overflow-y-auto">
        {/* Time slots column */}
        <div className="w-20 flex-shrink-0 border-r bg-secondary/40">
          {timeSlots.map((timeSlot) => (
            <div 
              key={timeSlot} 
              className="h-20 border-b px-2 py-1 text-xs text-muted-foreground flex items-start justify-end pr-2"
            >
              {timeSlot}
            </div>
          ))}
        </div>
        
        {/* Events column */}
        <div className="flex-grow relative">
          {/* Time slot grid lines */}
          {timeSlots.map((timeSlot) => (
            <div 
              key={timeSlot} 
              className="h-20 border-b w-full"
            />
          ))}
          
          {/* Events */}
          <div className="absolute top-0 left-0 w-full h-full p-1">
            {dayEvents.map((event) => {
              // Calculate position based on time
              const startHour = event.start.getHours();
              const startMinute = event.start.getMinutes();
              const endHour = event.end.getHours();
              const endMinute = event.end.getMinutes();
              
              const startPosition = (startHour + startMinute / 60) * 80; // 80px per hour
              const endPosition = (endHour + endMinute / 60) * 80;
              const eventHeight = endPosition - startPosition;
              
              return (
                <div
                  key={event.id}
                  className="absolute left-1 right-1 px-1"
                  style={{
                    top: `${startPosition}px`,
                    height: `${eventHeight}px`,
                    minHeight: '30px'
                  }}
                >
                  <CalendarEventItem
                    event={event}
                    onClick={onEventClick}
                    showTime
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DayView;
