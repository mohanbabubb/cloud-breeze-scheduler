
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Pencil, Trash2 } from 'lucide-react';
import { Counter, SAMPLE_COUNTERS } from '@/utils/rosterHelpers';

export function CounterManagement() {
  const [counters, setCounters] = useState<Counter[]>(SAMPLE_COUNTERS);
  const [isEditing, setIsEditing] = useState(false);
  const [editCounter, setEditCounter] = useState<Counter | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const handleAddCounter = () => {
    setIsEditing(true);
    setEditCounter(null);
    setName('');
    setDescription('');
  };
  
  const handleEditCounter = (counter: Counter) => {
    setIsEditing(true);
    setEditCounter(counter);
    setName(counter.name);
    setDescription(counter.description || '');
  };
  
  const handleDeleteCounter = (id: string) => {
    setCounters(counters.filter(counter => counter.id !== id));
  };
  
  const handleSaveCounter = () => {
    if (!name.trim()) return;
    
    if (editCounter) {
      // Update existing counter
      setCounters(counters.map(counter => 
        counter.id === editCounter.id 
          ? { ...counter, name, description }
          : counter
      ));
    } else {
      // Add new counter
      setCounters([
        ...counters,
        {
          id: crypto.randomUUID(),
          name,
          description
        }
      ]);
    }
    
    setIsEditing(false);
    setEditCounter(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Counter Management</h2>
          <p className="text-muted-foreground">Manage your supermarket counters</p>
        </div>
        
        <Button onClick={handleAddCounter}>
          <Building2 className="mr-2 h-4 w-4" />
          Add Counter
        </Button>
      </div>
      
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>{editCounter ? 'Edit Counter' : 'Add New Counter'}</CardTitle>
            <CardDescription>
              {editCounter ? 'Update counter details' : 'Enter details for the new counter'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Counter Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter counter name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter counter description"
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSaveCounter}>Save</Button>
          </CardFooter>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {counters.map((counter) => (
          <Card key={counter.id}>
            <CardHeader>
              <CardTitle>{counter.name}</CardTitle>
              <CardDescription>{counter.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <div className="flex space-x-2 ml-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEditCounter(counter)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteCounter(counter.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default CounterManagement;
