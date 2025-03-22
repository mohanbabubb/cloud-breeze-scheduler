import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shift, SAMPLE_EMPLOYEES, SAMPLE_COUNTERS } from '@/utils/rosterHelpers';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shift: Shift) => void;
  onDelete?: (shiftId: string) => void;
  shift?: Shift;
  selectedDate?: Date;
}

export function ShiftModal({ isOpen, onClose, onSave, onDelete, shift, selectedDate }: ShiftModalProps) {
  const [employeeId, setEmployeeId] = useState('');
  const [counterId, setCounterId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      if (shift) {
        setEmployeeId(shift.employeeId);
        setCounterId(shift.counterId);
        setStartDate(format(shift.start, 'yyyy-MM-dd'));
        setStartTime(format(shift.start, 'HH:mm'));
        setEndDate(format(shift.end, 'yyyy-MM-dd'));
        setEndTime(format(shift.end, 'HH:mm'));
      } else {
        setEmployeeId(SAMPLE_EMPLOYEES[0].id);
        setCounterId(SAMPLE_COUNTERS[0].id);
        const dateToUse = selectedDate || new Date();
        setStartDate(format(dateToUse, 'yyyy-MM-dd'));
        setStartTime('09:00');
        setEndDate(format(dateToUse, 'yyyy-MM-dd'));
        setEndTime('17:00');
      }
    }
  }, [isOpen, shift, selectedDate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const employee = SAMPLE_EMPLOYEES.find(e => e.id === employeeId);
    const counter = SAMPLE_COUNTERS.find(c => c.id === counterId);
    
    if (!employee || !counter) return;
    
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    
    const newShift: Shift = {
      id: shift?.id || crypto.randomUUID(),
      title: `${employee.name} - ${counter.name}`,
      description: `${employee.position} working at ${counter.name}`,
      location: counter.name,
      start: startDateTime,
      end: endDateTime,
      employeeId,
      counterId,
      color: employee.color
    };
    
    onSave(newShift);
    onClose();
  };
  
  const handleDelete = () => {
    if (shift && onDelete) {
      onDelete(shift.id);
      onClose();
    }
  };
  
  const selectedEmployee = SAMPLE_EMPLOYEES.find(e => e.id === employeeId);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {shift ? 'Edit Shift' : 'New Shift'}
          </DialogTitle>
          <DialogDescription>
            {shift ? 'Update employee shift details' : 'Assign an employee to a counter shift'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="employee">Employee</Label>
            <Select 
              value={employeeId} 
              onValueChange={setEmployeeId}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {SAMPLE_EMPLOYEES.map((employee) => (
                  <SelectItem 
                    key={employee.id} 
                    value={employee.id}
                  >
                    {employee.name} ({employee.position})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="counter">Counter</Label>
            <Select 
              value={counterId} 
              onValueChange={setCounterId}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a counter" />
              </SelectTrigger>
              <SelectContent>
                {SAMPLE_COUNTERS.map((counter) => (
                  <SelectItem 
                    key={counter.id} 
                    value={counter.id}
                  >
                    {counter.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          
          {selectedEmployee && (
            <div className="pt-2">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-4 h-4 rounded-full",
                  selectedEmployee.color?.split(' ')[0] || "bg-blue-100"
                )} />
                <span className="text-sm font-medium">{selectedEmployee.name}</span>
                <span className="text-sm text-muted-foreground">({selectedEmployee.position})</span>
              </div>
            </div>
          )}
          
          <DialogFooter className="mt-6">
            <div className="flex w-full justify-between items-center">
              {shift && onDelete && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleDelete}
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              )}
              <div className="ml-auto flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {shift ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ShiftModal;
