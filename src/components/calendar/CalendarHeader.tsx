
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ViewType, formatDate } from '@/utils/calendarHelpers';
import { cn } from '@/lib/utils';

interface CalendarHeaderProps {
  currentDate: Date;
  view: ViewType;
  onDateChange: (date: Date) => void;
  onViewChange: (view: ViewType) => void;
}

export function CalendarHeader({ 
  currentDate, 
  view, 
  onDateChange, 
  onViewChange 
}: CalendarHeaderProps) {
  const [isChangingView, setIsChangingView] = useState(false);
  
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
    }
    onDateChange(newDate);
  };
  
  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
    }
    onDateChange(newDate);
  };
  
  const handleToday = () => {
    onDateChange(new Date());
  };
  
  const handleViewChange = (newView: ViewType) => {
    setIsChangingView(true);
    setTimeout(() => {
      onViewChange(newView);
      setIsChangingView(false);
    }, 300);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 px-2 gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          className="h-9 w-9 transition-all hover:translate-x-[-2px]"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div 
          className={cn(
            "text-xl font-semibold transition-all duration-300",
            isChangingView ? "opacity-0 scale-95" : "opacity-100"
          )}
        >
          {formatDate(currentDate, view)}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          className="h-9 w-9 transition-all hover:translate-x-[2px]"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleToday}
          className="h-9"
        >
          Today
        </Button>
        
        <div className="flex bg-secondary p-1 rounded-md">
          <ViewButton 
            text="Month" 
            active={view === 'month'} 
            onClick={() => handleViewChange('month')} 
          />
          <ViewButton 
            text="Week" 
            active={view === 'week'} 
            onClick={() => handleViewChange('week')} 
          />
          <ViewButton 
            text="Day" 
            active={view === 'day'} 
            onClick={() => handleViewChange('day')} 
          />
        </div>
      </div>
    </div>
  );
}

interface ViewButtonProps {
  text: string;
  active: boolean;
  onClick: () => void;
}

function ViewButton({ text, active, onClick }: ViewButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-sm font-medium px-3 py-1 rounded-md transition-all",
        active 
          ? "bg-white dark:bg-gray-800 text-primary shadow-sm" 
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {text}
    </button>
  );
}

export default CalendarHeader;
