
import { addDays, addMonths, format, getDay, getDaysInMonth, isSameDay, isSameMonth, parse, startOfMonth, subMonths } from 'date-fns';

export type ViewType = 'month' | 'week' | 'day';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  description?: string;
  location?: string;
}

export const CALENDAR_VIEWS: ViewType[] = ['month', 'week', 'day'];

export const DEFAULT_EVENT_COLORS = [
  'bg-blue-100 text-blue-600 border-blue-200',
  'bg-purple-100 text-purple-600 border-purple-200',
  'bg-green-100 text-green-600 border-green-200',
  'bg-amber-100 text-amber-600 border-amber-200',
  'bg-red-100 text-red-600 border-red-200',
  'bg-indigo-100 text-indigo-600 border-indigo-200',
];

/**
 * Generate an array of dates for the month view
 */
export function getMonthDates(currentDate: Date): Date[] {
  const firstDayOfMonth = startOfMonth(currentDate);
  const dayOfWeek = getDay(firstDayOfMonth);
  const daysInMonth = getDaysInMonth(currentDate);
  
  // Create array for all days in the month view
  const days: Date[] = [];
  
  // Add days from the previous month
  for (let i = dayOfWeek - 1; i >= 0; i--) {
    days.push(addDays(firstDayOfMonth, -1 - i));
  }
  
  // Add days from the current month
  for (let i = 0; i < daysInMonth; i++) {
    days.push(addDays(firstDayOfMonth, i));
  }
  
  // Add days from the next month to complete the 6 rows (42 days)
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push(addDays(addDays(firstDayOfMonth, daysInMonth), i - 1));
  }
  
  return days;
}

/**
 * Get events for a specific day
 */
export function getEventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  return events.filter(event => isSameDay(event.start, day));
}

/**
 * Get events for the current month view
 */
export function getEventsForMonth(events: CalendarEvent[], currentDate: Date): CalendarEvent[] {
  return events.filter(event => isSameMonth(event.start, currentDate));
}

/**
 * Navigate to previous month
 */
export function goToPreviousMonth(currentDate: Date): Date {
  return subMonths(currentDate, 1);
}

/**
 * Navigate to next month
 */
export function goToNextMonth(currentDate: Date): Date {
  return addMonths(currentDate, 1);
}

/**
 * Format a date based on the view type
 */
export function formatDate(date: Date, viewType: ViewType): string {
  switch (viewType) {
    case 'month':
      return format(date, 'MMMM yyyy');
    case 'week':
      const startOfWeek = addDays(date, -getDay(date));
      const endOfWeek = addDays(startOfWeek, 6);
      return `${format(startOfWeek, 'MMM d')} - ${format(endOfWeek, 'MMM d, yyyy')}`;
    case 'day':
      return format(date, 'EEEE, MMMM d, yyyy');
    default:
      return format(date, 'MMMM d, yyyy');
  }
}
