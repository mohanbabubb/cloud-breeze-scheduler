import { useState, useEffect } from 'react';
import { MonthView } from '@/components/calendar/MonthView';
import { DayView } from '@/components/calendar/DayView';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { ShiftModal } from '@/components/calendar/ShiftModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CalendarEvent, ViewType } from '@/utils/calendarHelpers';
import { Shift, generateSampleShifts } from '@/utils/rosterHelpers';
import { useTransition } from '@/utils/animations';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployeeManagement } from '@/components/roster/EmployeeManagement';
import { CounterManagement } from '@/components/roster/CounterManagement';

interface CalendarViewProps {
  className?: string;
}

export function CalendarView({ className }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('month');
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [selectedShift, setSelectedShift] = useState<Shift | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [shouldAnimateView, setShouldAnimateView] = useState(false);
  const [showView, viewTransitionState] = useTransition(true);
  const [activeTab, setActiveTab] = useState('roster');
  
  // Demo shifts
  useEffect(() => {
    setShifts(generateSampleShifts());
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
  
  // Handle shift creation/update
  const handleSaveShift = (shift: Shift) => {
    if (shifts.some(s => s.id === shift.id)) {
      // Update existing shift
      setShifts(shifts.map(s => s.id === shift.id ? shift : s));
    } else {
      // Add new shift
      setShifts([...shifts, shift]);
    }
  };
  
  // Handle event update from drag-and-drop
  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    const updatedShift = updatedEvent as Shift;
    setShifts(shifts.map(s => s.id === updatedShift.id ? updatedShift : s));
  };
  
  // Handle shift click
  const handleShiftClick = (shift: Shift) => {
    setSelectedShift(shift);
    setIsShiftModalOpen(true);
  };
  
  // Handle date click
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedShift(undefined);
    setIsShiftModalOpen(true);
  };
  
  // Render appropriate view
  const renderView = () => {
    switch (activeTab) {
      case 'roster':
        switch (view) {
          case 'month':
            return (
              <MonthView
                currentDate={currentDate}
                events={shifts as CalendarEvent[]}
                onDateClick={handleDateClick}
                onEventClick={handleShiftClick as (event: CalendarEvent) => void}
                transitionState={shouldAnimateView ? 'from' : 'to'}
              />
            );
          case 'week':
            return (
              <div className="flex items-center justify-center h-96 bg-card rounded-lg">
                <p className="text-muted-foreground">Week view coming soon</p>
              </div>
            );
          case 'day':
            return (
              <DayView
                currentDate={currentDate}
                events={shifts as CalendarEvent[]}
                onEventClick={handleShiftClick as (event: CalendarEvent) => void}
                transitionState={shouldAnimateView ? 'from' : 'to'}
                onEventUpdate={handleEventUpdate}
              />
            );
          default:
            return null;
        }
      case 'employees':
        return <EmployeeManagement />;
      case 'counters':
        return <CounterManagement />;
      default:
        return null;
    }
  };
  
  return (
    <div className={cn("max-w-6xl mx-auto", className)}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="roster">Roster Schedule</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="counters">Counters</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {activeTab === 'roster' && (
        <div className="flex justify-between items-center mb-4">
          <CalendarHeader
            currentDate={currentDate}
            view={view}
            onDateChange={handleDateChange}
            onViewChange={handleViewChange}
          />
          
          <Button 
            onClick={() => {
              setSelectedShift(undefined);
              setSelectedDate(new Date());
              setIsShiftModalOpen(true);
            }}
            className="ml-2"
          >
            <Plus className="mr-1 h-4 w-4" />
            <span>Add Shift</span>
          </Button>
        </div>
      )}
      
      {showView && renderView()}
      
      <ShiftModal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        onSave={handleSaveShift}
        shift={selectedShift}
        selectedDate={selectedDate}
      />
    </div>
  );
}

export default CalendarView;
