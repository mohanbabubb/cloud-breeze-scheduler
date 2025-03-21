
import { useState, useEffect } from 'react';
import { MonthView } from '@/components/calendar/MonthView';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { EventModal } from '@/components/calendar/EventModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CalendarEvent, ViewType } from '@/utils/calendarHelpers';
import { useTransition } from '@/utils/animations';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  className?: string;
}

export function CalendarView({ className }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [shouldAnimateView, setShouldAnimateView] = useState(false);
  const [showView, viewTransitionState] = useTransition(true);
  
  // Demo events
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    const demoEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Team Meeting',
        start: new Date(today.setHours(10, 0, 0, 0)),
        end: new Date(today.setHours(11, 30, 0, 0)),
        location: 'Conference Room A',
        description: 'Weekly team sync-up',
        color: 'bg-blue-100 text-blue-600 border-blue-200'
      },
      {
        id: '2',
        title: 'Project Review',
        start: new Date(today.setHours(14, 0, 0, 0)),
        end: new Date(today.setHours(15, 0, 0, 0)),
        location: 'Virtual',
        color: 'bg-purple-100 text-purple-600 border-purple-200'
      },
      {
        id: '3',
        title: 'Client Call',
        start: new Date(tomorrow.setHours(11, 0, 0, 0)),
        end: new Date(tomorrow.setHours(12, 0, 0, 0)),
        location: 'Phone',
        color: 'bg-green-100 text-green-600 border-green-200'
      }
    ];
    
    setEvents(demoEvents);
  }, []);
  
  // Handle date changes
  const handleDateChange = (date: Date) => {
    setShouldAnimateView(true);
    setTimeout(() => {
      setCurrentDate(date);
      setShouldAnimateView(false);
    }, 300);
  };
  
  // Handle view changes
  const handleViewChange = (newView: ViewType) => {
    setShouldAnimateView(true);
    setTimeout(() => {
      setView(newView);
      setShouldAnimateView(false);
    }, 300);
  };
  
  // Handle event creation/update
  const handleSaveEvent = (event: CalendarEvent) => {
    if (events.some(e => e.id === event.id)) {
      // Update existing event
      setEvents(events.map(e => e.id === event.id ? event : e));
    } else {
      // Add new event
      setEvents([...events, event]);
    }
  };
  
  // Handle event click
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };
  
  // Handle date click
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(undefined);
    setIsEventModalOpen(true);
  };
  
  // Render appropriate view
  const renderView = () => {
    switch (view) {
      case 'month':
        return (
          <MonthView
            currentDate={currentDate}
            events={events}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
            transitionState={shouldAnimateView ? 'from' : 'to'}
          />
        );
      case 'week':
        // Week view would go here
        return (
          <div className="flex items-center justify-center h-96 bg-card rounded-lg">
            <p className="text-muted-foreground">Week view coming soon</p>
          </div>
        );
      case 'day':
        // Day view would go here
        return (
          <div className="flex items-center justify-center h-96 bg-card rounded-lg">
            <p className="text-muted-foreground">Day view coming soon</p>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className={cn("max-w-6xl mx-auto", className)}>
      <div className="flex justify-between items-center mb-4">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onDateChange={handleDateChange}
          onViewChange={handleViewChange}
        />
        
        <Button 
          onClick={() => {
            setSelectedEvent(undefined);
            setSelectedDate(new Date());
            setIsEventModalOpen(true);
          }}
          className="ml-2"
        >
          <Plus className="mr-1 h-4 w-4" />
          <span>Add Event</span>
        </Button>
      </div>
      
      {showView && renderView()}
      
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
        event={selectedEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
}

export default CalendarView;
