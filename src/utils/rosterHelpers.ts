
import { CalendarEvent } from './calendarHelpers';

export interface Employee {
  id: string;
  name: string;
  position: string;
  color?: string;
}

export interface Counter {
  id: string;
  name: string;
  description?: string;
}

export interface Shift extends CalendarEvent {
  employeeId: string;
  counterId: string;
}

// Sample employees
export const SAMPLE_EMPLOYEES: Employee[] = [
  { id: '1', name: 'John Smith', position: 'Cashier', color: 'bg-blue-100 text-blue-600 border-blue-200' },
  { id: '2', name: 'Sarah Johnson', position: 'Manager', color: 'bg-purple-100 text-purple-600 border-purple-200' },
  { id: '3', name: 'Mike Brown', position: 'Stocker', color: 'bg-green-100 text-green-600 border-green-200' },
  { id: '4', name: 'Lisa Davis', position: 'Deli Worker', color: 'bg-amber-100 text-amber-600 border-amber-200' },
  { id: '5', name: 'David Wilson', position: 'Bakery', color: 'bg-red-100 text-red-600 border-red-200' },
  { id: '6', name: 'Jennifer Lee', position: 'Produce', color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
  { id: '7', name: 'Robert Taylor', position: 'Butcher', color: 'bg-blue-100 text-blue-600 border-blue-200' },
  { id: '8', name: 'Emily White', position: 'Cashier', color: 'bg-purple-100 text-purple-600 border-purple-200' },
];

// Sample counters
export const SAMPLE_COUNTERS: Counter[] = [
  { id: '1', name: 'Checkout 1', description: 'Main checkout counter' },
  { id: '2', name: 'Checkout 2', description: 'Express lane (10 items or less)' },
  { id: '3', name: 'Customer Service', description: 'Returns and customer inquiries' },
  { id: '4', name: 'Deli Counter', description: 'Fresh meat and cheese service' },
  { id: '5', name: 'Bakery', description: 'Fresh bread and pastries' },
  { id: '6', name: 'Produce', description: 'Fruits and vegetables section' },
  { id: '7', name: 'Butcher', description: 'Fresh meat counter' },
];

// Generate sample shifts
export function generateSampleShifts(): Shift[] {
  const today = new Date();
  const shifts: Shift[] = [];
  
  // Generate shifts for the next 7 days
  for (let day = 0; day < 7; day++) {
    const shiftDate = new Date(today);
    shiftDate.setDate(today.getDate() + day);
    
    // Morning shift (8am - 4pm)
    SAMPLE_COUNTERS.forEach((counter, counterIndex) => {
      const employeeIndex = (counterIndex + day) % SAMPLE_EMPLOYEES.length;
      const employee = SAMPLE_EMPLOYEES[employeeIndex];
      
      const morningStart = new Date(shiftDate);
      morningStart.setHours(8, 0, 0, 0);
      
      const morningEnd = new Date(shiftDate);
      morningEnd.setHours(16, 0, 0, 0);
      
      shifts.push({
        id: `morning-${day}-${counter.id}`,
        title: `${employee.name} - ${counter.name}`,
        start: morningStart,
        end: morningEnd,
        employeeId: employee.id,
        counterId: counter.id,
        location: counter.name,
        color: employee.color,
      });
    });
    
    // Evening shift (4pm - 12am)
    SAMPLE_COUNTERS.forEach((counter, counterIndex) => {
      const employeeIndex = (counterIndex + day + 3) % SAMPLE_EMPLOYEES.length;
      const employee = SAMPLE_EMPLOYEES[employeeIndex];
      
      const eveningStart = new Date(shiftDate);
      eveningStart.setHours(16, 0, 0, 0);
      
      const eveningEnd = new Date(shiftDate);
      eveningEnd.setHours(23, 59, 59, 0);
      
      shifts.push({
        id: `evening-${day}-${counter.id}`,
        title: `${employee.name} - ${counter.name}`,
        start: eveningStart,
        end: eveningEnd,
        employeeId: employee.id,
        counterId: counter.id,
        location: counter.name,
        color: employee.color,
      });
    });
    
    // Overnight shift (12am - 8am)
    SAMPLE_COUNTERS.forEach((counter, counterIndex) => {
      const employeeIndex = (counterIndex + day + 5) % SAMPLE_EMPLOYEES.length;
      const employee = SAMPLE_EMPLOYEES[employeeIndex];
      
      const overnightStart = new Date(shiftDate);
      overnightStart.setHours(0, 0, 0, 0);
      
      const overnightEnd = new Date(shiftDate);
      overnightEnd.setHours(8, 0, 0, 0);
      
      shifts.push({
        id: `overnight-${day}-${counter.id}`,
        title: `${employee.name} - ${counter.name}`,
        start: overnightStart,
        end: overnightEnd,
        employeeId: employee.id,
        counterId: counter.id,
        location: counter.name,
        color: employee.color,
      });
    });
  }
  
  return shifts;
}
