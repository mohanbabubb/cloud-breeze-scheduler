
import { useState, useEffect } from 'react';
import { format, isSameDay, setHours, setMinutes, addMinutes } from 'date-fns';
import { CalendarEvent } from '@/utils/calendarHelpers';
import { CalendarEventItem } from '@/components/ui/CalendarEvent';
import { cn } from '@/lib/utils';
import { getTransitionClasses } from '@/utils/animations';
import { SAMPLE_COUNTERS, Shift } from '@/utils/rosterHelpers';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

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
  const [timeSlots, setTimeSlots] = useState<Date[]>([]);
  
  // Generate time slots for every 45 minutes
  useEffect(() => {
    const slots: Date[] = [];
    const startOfDay = new Date(currentDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    // Generate time slots for every 45 minutes (32 slots in a day)
    for (let i = 0; i < 32; i++) {
      slots.push(addMinutes(startOfDay, i * 45));
    }
    
    setTimeSlots(slots);
    
    // Filter events for the current day
    const filteredEvents = events.filter(event => 
      isSameDay(event.start, currentDate)
    );
    
    setDayEvents(filteredEvents);
  }, [currentDate, events]);
  
  // Find event for a specific counter and time slot
  const findEvent = (counterId: string, timeSlot: Date) => {
    return dayEvents.find(event => {
      const shift = event as Shift;
      if (shift.counterId !== counterId) return false;
      
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const slotTime = new Date(timeSlot);
      const slotEnd = addMinutes(slotTime, 45);
      
      // Check if the time slot overlaps with the event
      return (
        (slotTime >= eventStart && slotTime < eventEnd) ||
        (slotEnd > eventStart && slotEnd <= eventEnd) ||
        (eventStart >= slotTime && eventStart < slotEnd)
      );
    });
  };
  
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
        <p className="text-sm text-muted-foreground mt-1">
          Counter schedule view (45-minute intervals)
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">Counter</TableHead>
              {timeSlots.map((slot, index) => (
                <TableHead key={index} className="min-w-[100px] text-center">
                  {format(slot, 'HH:mm')}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {SAMPLE_COUNTERS.map(counter => (
              <TableRow key={counter.id}>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-semibold">{counter.name}</div>
                    {counter.description && (
                      <div className="text-xs text-muted-foreground">{counter.description}</div>
                    )}
                  </div>
                </TableCell>
                {timeSlots.map((slot, index) => {
                  const event = findEvent(counter.id, slot);
                  return (
                    <TableCell key={index} className="p-1 border-l">
                      {event ? (
                        <CalendarEventItem
                          event={event}
                          onClick={onEventClick}
                          isCompact={true}
                        />
                      ) : null}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default DayView;
