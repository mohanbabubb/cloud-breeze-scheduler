
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CalendarEvent, DEFAULT_EVENT_COLORS } from '@/utils/calendarHelpers';
import { format } from 'date-fns';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  event?: CalendarEvent;
  selectedDate?: Date;
}

export function EventModal({ isOpen, onClose, onSave, event, selectedDate }: EventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedColor, setSelectedColor] = useState(DEFAULT_EVENT_COLORS[0]);
  
  // Initialize form when modal opens or event changes
  useEffect(() => {
    if (isOpen) {
      if (event) {
        setTitle(event.title);
        setDescription(event.description || '');
        setLocation(event.location || '');
        setStartDate(format(event.start, 'yyyy-MM-dd'));
        setStartTime(format(event.start, 'HH:mm'));
        setEndDate(format(event.end, 'yyyy-MM-dd'));
        setEndTime(format(event.end, 'HH:mm'));
        setSelectedColor(event.color || DEFAULT_EVENT_COLORS[0]);
      } else {
        // Reset form and use selected date if provided
        setTitle('');
        setDescription('');
        setLocation('');
        const dateToUse = selectedDate || new Date();
        setStartDate(format(dateToUse, 'yyyy-MM-dd'));
        setStartTime('09:00');
        setEndDate(format(dateToUse, 'yyyy-MM-dd'));
        setEndTime('10:00');
        setSelectedColor(DEFAULT_EVENT_COLORS[0]);
      }
    }
  }, [isOpen, event, selectedDate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create date objects from form inputs
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    
    // Create new event object
    const newEvent: CalendarEvent = {
      id: event?.id || crypto.randomUUID(),
      title,
      description,
      location,
      start: startDateTime,
      end: endDateTime,
      color: selectedColor
    };
    
    onSave(newEvent);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {event ? 'Edit Event' : 'New Event'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add title"
              required
              className="transition-all focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
            />
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
          
          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description"
              className="resize-none"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_EVENT_COLORS.map((color, index) => (
                <button
                  key={index}
                  type="button"
                  className={cn(
                    "w-8 h-8 rounded-full transition-all",
                    color.split(' ')[0], // Extract bg color
                    selectedColor === color ? "ring-2 ring-offset-2 ring-primary" : ""
                  )}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button type="submit">
              {event ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Add missing imports
import { cn } from '@/lib/utils';

export default EventModal;
