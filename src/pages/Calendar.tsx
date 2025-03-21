
import { useState, useEffect } from 'react';
import { CalendarView } from '@/components/calendar/CalendarView';
import Header from '@/components/layout/Header';
import { cn } from '@/lib/utils';

export default function CalendarPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 px-4 sm:px-6 pt-20 pb-12">
        <div className={cn(
          "w-full transition-all duration-500",
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}>
          <CalendarView />
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Calendar App. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
