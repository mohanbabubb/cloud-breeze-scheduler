
import { useState, useEffect } from 'react';
import { format, isSameDay, setHours, setMinutes, addMinutes } from 'date-fns';
import { CalendarEvent } from '@/utils/calendarHelpers';
import { CalendarEventItem } from '@/components/ui/CalendarEvent';
import { cn } from '@/lib/utils';
import { getTransitionClasses } from '@/utils/animations';
import { SAMPLE_COUNTERS, Shift } from '@/utils/rosterHelpers';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { toast } from 'sonner';
import { Slider } from '@/components/ui/slider';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Plus, Edit, Trash2, Undo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addHistoryEntry, getLastHistoryEntry, undoLastAction } from '@/utils/historyHelpers';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
  transitionState?: 'from' | 'to';
  onEventUpdate?: (updatedEvent: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  onEventCreate?: (counterId: string, timeSlot: Date) => void;
}

export function DayView({
  currentDate,
  events,
  onEventClick,
  className,
  transitionState = 'to',
  onEventUpdate,
  onEventDelete,
  onEventCreate
}: DayViewProps) {
  const [dayEvents, setDayEvents] = useState<CalendarEvent[]>([]);
  const [timeSlots, setTimeSlots] = useState<Date[]>([]);
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [columnWidth, setColumnWidth] = useState(100);
  const [timeInterval, setTimeInterval] = useState(45); // Default 45 minutes
  
  // Generate time slots based on selected interval
  useEffect(() => {
    const slots: Date[] = [];
    const startOfDay = new Date(currentDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    // Calculate how many slots we need based on the interval
    const minutesInDay = 24 * 60;
    const numSlots = Math.ceil(minutesInDay / timeInterval);
    
    for (let i = 0; i < numSlots; i++) {
      slots.push(addMinutes(startOfDay, i * timeInterval));
    }
    
    setTimeSlots(slots);
    
    // Filter events for the current day
    const filteredEvents = events.filter(event => 
      isSameDay(event.start, currentDate)
    );
    
    setDayEvents(filteredEvents);
  }, [currentDate, events, timeInterval]);
  
  // Calculate time interval based on slider value
  const handleTimeIntervalChange = (value: number[]) => {
    const intervals = [15, 30, 45, 60, 120, 240, 480]; // 15min, 30min, 45min, 1hr, 2hr, 4hr, 8hr
    const selectedInterval = intervals[value[0]];
    setTimeInterval(selectedInterval);
    
    // Adjust column width based on the interval
    // Larger intervals should have wider columns
    const baseWidth = 60;
    const widths = [baseWidth, baseWidth * 1.2, baseWidth * 1.5, baseWidth * 2, baseWidth * 3, baseWidth * 4, baseWidth * 5];
    setColumnWidth(widths[value[0]]);
  };
  
  // Find events for a specific counter and time slot (potentially multiple events)
  const findEvents = (counterId: string, timeSlot: Date): Shift[] => {
    return dayEvents.filter(event => {
      const shift = event as Shift;
      if (shift.counterId !== counterId) return false;
      
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const slotTime = new Date(timeSlot);
      const slotEnd = addMinutes(slotTime, timeInterval);
      
      // Check if the time slot overlaps with the event
      return (
        (slotTime >= eventStart && slotTime < eventEnd) ||
        (slotEnd > eventStart && slotEnd <= eventEnd) ||
        (eventStart >= slotTime && eventStart < slotEnd)
      );
    }) as Shift[];
  };
  
  // Check if there's already an event for this counter and time slot from a different employee
  const hasConflict = (counterId: string, timeSlot: Date, currentEvent?: CalendarEvent) => {
    const existingEvents = findEvents(counterId, timeSlot);
    
    if (existingEvents.length === 0 || !currentEvent) return false;
    
    // Check against all existing events
    const currentShift = currentEvent as Shift;
    
    return existingEvents.some(existingShift => 
      existingShift.id !== currentShift.id && 
      existingShift.employeeId !== currentShift.employeeId
    );
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
      
      // Check for conflicts - now we'll allow conflicts but warn about them
      if (hasConflict(counterId, timeSlot, originalEvent)) {
        toast.warning("Note: Another employee is also assigned to this counter at this time");
      }
      
      // Update the event through callback
      if (onEventUpdate) {
        // Store the original event for history tracking
        addHistoryEntry("update", originalEvent as Shift, updatedEvent as Shift);
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
  
  const handleUndo = () => {
    const lastEntry = getLastHistoryEntry();
    if (!lastEntry) {
      toast.info("Nothing to undo");
      return;
    }
    
    const result = undoLastAction();
    
    if (result.success) {
      if (result.actionType === "create" && onEventDelete && result.oldShift) {
        onEventDelete(result.oldShift.id);
      } else if (result.actionType === "update" && onEventUpdate && result.oldShift) {
        onEventUpdate(result.oldShift);
      } else if (result.actionType === "delete" && result.oldShift) {
        if (onEventUpdate) {
          onEventUpdate(result.oldShift);
        }
      }
      toast.success("Action undone successfully");
    } else {
      toast.error("Failed to undo the last action");
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
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <div>
            <h2 className="text-xl font-semibold">
              {format(currentDate, 'EEEE, MMMM d, yyyy')}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Counter schedule view ({timeInterval}-minute intervals) - Drag shifts to update time or counter
            </p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex flex-col flex-1 md:w-64">
              <span className="text-sm mb-1">Time interval:</span>
              <Slider
                defaultValue={[2]} // Default to 45 minutes (index 2)
                max={6} // 7 options from 15min to 8hr
                step={1}
                onValueChange={handleTimeIntervalChange}
                className="my-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>15m</span>
                <span>30m</span>
                <span>45m</span>
                <span>1h</span>
                <span>2h</span>
                <span>4h</span>
                <span>8h</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleUndo}
              className="flex items-center gap-1"
            >
              <Undo className="h-4 w-4" />
              Undo
            </Button>
          </div>
        </div>
      </div>
      
      {/* Add horizontal scrollbar at the top */}
      <ScrollArea className="w-full" orientation="horizontal">
        <div className="overflow-x-auto min-w-max">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-40 sticky left-0 z-20 bg-background">Counter</TableHead>
                {timeSlots.map((slot, index) => (
                  <TableHead 
                    key={index} 
                    className="text-center"
                    style={{ minWidth: `${columnWidth}px` }}
                  >
                    {format(slot, 'HH:mm')}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {SAMPLE_COUNTERS.map(counter => (
                <TableRow key={counter.id}>
                  <TableCell className="font-medium sticky left-0 z-10 bg-background">
                    <div>
                      <div className="font-semibold">{counter.name}</div>
                      {counter.description && (
                        <div className="text-xs text-muted-foreground">{counter.description}</div>
                      )}
                    </div>
                  </TableCell>
                  {timeSlots.map((slot, index) => {
                    const events = findEvents(counter.id, slot);
                    return (
                      <TableCell 
                        key={index} 
                        className={cn(
                          "p-1 border-l min-h-[60px]",
                          events.length === 0 && "hover:bg-muted/50 transition-colors"
                        )}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, counter.id, slot)}
                        style={{ minWidth: `${columnWidth}px` }}
                      >
                        <ContextMenu>
                          <ContextMenuTrigger className="flex h-full w-full min-h-[60px]">
                            {events.length > 0 ? (
                              <div className={cn(
                                "w-full h-full flex flex-col gap-1", 
                                events.length > 1 ? "justify-start" : "justify-center"
                              )}>
                                {events.map((event) => (
                                  <CalendarEventItem
                                    key={event.id}
                                    event={event}
                                    onClick={onEventClick}
                                    isCompact={true}
                                    isDraggable={true}
                                    onDragStart={handleDragStart}
                                  />
                                ))}
                              </div>
                            ) : null}
                          </ContextMenuTrigger>
                          <ContextMenuContent>
                            {events.length > 0 ? (
                              <>
                                {events.map((event) => (
                                  <React.Fragment key={event.id}>
                                    <ContextMenuItem 
                                      onClick={() => onEventClick && onEventClick(event)}
                                      className="flex items-center gap-2"
                                    >
                                      <Edit className="h-4 w-4" />
                                      Edit {event.title.split(' - ')[0]}'s Shift
                                    </ContextMenuItem>
                                    <ContextMenuItem 
                                      onClick={() => {
                                        if (onEventDelete) {
                                          addHistoryEntry("delete", event);
                                          onEventDelete(event.id);
                                          toast.success("Shift deleted");
                                        }
                                      }}
                                      className="flex items-center gap-2 text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Delete {event.title.split(' - ')[0]}'s Shift
                                    </ContextMenuItem>
                                  </React.Fragment>
                                ))}
                              </>
                            ) : (
                              <ContextMenuItem 
                                onClick={() => {
                                  if (onEventCreate) {
                                    onEventCreate(counter.id, slot);
                                  }
                                }}
                                className="flex items-center gap-2"
                              >
                                <Plus className="h-4 w-4" />
                                Add Shift
                              </ContextMenuItem>
                            )}
                          </ContextMenuContent>
                        </ContextMenu>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  );
}

export default DayView;
