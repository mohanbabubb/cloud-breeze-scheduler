
import { useState, useEffect } from 'react';
import { format, isSameDay, setHours, setMinutes, addMinutes } from 'date-fns';
import { CalendarEvent } from '@/utils/calendarHelpers';
import { CalendarEventItem } from '@/components/ui/CalendarEvent';
import { cn } from '@/lib/utils';
import { getTransitionClasses } from '@/utils/animations';
import { SAMPLE_COUNTERS, Shift } from '@/utils/rosterHelpers';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { toast } from 'sonner';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
  transitionState?: 'from' | 'to';
  onEventUpdate?: (updatedEvent: CalendarEvent) => void;
}

export function DayView({
  currentDate,
  events,
  onEventClick,
  className,
  transitionState = 'to',
  onEventUpdate
}: DayViewProps) {
  const [dayEvents, setDayEvents] = useState<CalendarEvent[]>([]);
  const [timeSlots, setTimeSlots] = useState<Date[]>([]);
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  
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
  
  const handleDragStart = (e: React.DragEvent, event: CalendarEvent) => {
    setDraggedEvent(event);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, counterId: string, timeSlot: Date) => {
    e.preventDefault();
    
    if (!draggedEvent) return;
    
    try {
      // Calculate new start and end times
      const slotTime = new Date(timeSlot);
      const eventData = JSON.parse(e.dataTransfer.getData('application/json')) as CalendarEvent;
      const originalEvent = events.find(event => event.id === eventData.id);
      
      if (!originalEvent) return;
      
      const originalStart = new Date(originalEvent.start);
      const originalEnd = new Date(originalEvent.end);
      const duration = originalEnd.getTime() - originalStart.getTime();
      
      // Create new start and end times based on the drop target slot
      const newStart = new Date(slotTime);
      const newEnd = new Date(newStart.getTime() + duration);
      
      // Create updated event
      const updatedEvent: CalendarEvent = {
        ...originalEvent,
        start: newStart,
        end: newEnd,
        ...(originalEvent as Shift).counterId ? { counterId } : {}
      };
      
      // Update the event through callback
      if (onEventUpdate) {
        onEventUpdate(updatedEvent);
        toast.success("Shift updated successfully");
      }
    } catch (error) {
      console.error("Error updating shift:", error);
      toast.error("Failed to update shift");
    } finally {
      setDraggedEvent(null);
    }
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
          Counter schedule view (45-minute intervals) - Drag shifts to update time or counter
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
                    <TableCell 
                      key={index} 
                      className={cn(
                        "p-1 border-l min-h-[40px]",
                        !event && "hover:bg-muted/50 transition-colors"
                      )}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, counter.id, slot)}
                    >
                      {event ? (
                        <CalendarEventItem
                          event={event}
                          onClick={onEventClick}
                          isCompact={true}
                          isDraggable={true}
                          onDragStart={handleDragStart}
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
