
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
import { UserPlus, Pencil, Trash2 } from 'lucide-react';
import { Employee, SAMPLE_EMPLOYEES, DEFAULT_EVENT_COLORS } from '@/utils/rosterHelpers';
import { cn } from '@/lib/utils';

export function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>(SAMPLE_EMPLOYEES);
  const [isEditing, setIsEditing] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [selectedColor, setSelectedColor] = useState(DEFAULT_EVENT_COLORS[0]);
  
  const handleAddEmployee = () => {
    setIsEditing(true);
    setEditEmployee(null);
    setName('');
    setPosition('');
    setSelectedColor(DEFAULT_EVENT_COLORS[0]);
  };
  
  const handleEditEmployee = (employee: Employee) => {
    setIsEditing(true);
    setEditEmployee(employee);
    setName(employee.name);
    setPosition(employee.position);
    setSelectedColor(employee.color || DEFAULT_EVENT_COLORS[0]);
  };
  
  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter(employee => employee.id !== id));
  };
  
  const handleSaveEmployee = () => {
    if (!name.trim() || !position.trim()) return;
    
    if (editEmployee) {
      // Update existing employee
      setEmployees(employees.map(employee => 
        employee.id === editEmployee.id 
          ? { ...employee, name, position, color: selectedColor }
          : employee
      ));
    } else {
      // Add new employee
      setEmployees([
        ...employees,
        {
          id: crypto.randomUUID(),
          name,
          position,
          color: selectedColor
        }
      ]);
    }
    
    setIsEditing(false);
    setEditEmployee(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Employee Management</h2>
          <p className="text-muted-foreground">Manage your supermarket staff</p>
        </div>
        
        <Button onClick={handleAddEmployee}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>
      
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>{editEmployee ? 'Edit Employee' : 'Add New Employee'}</CardTitle>
            <CardDescription>
              {editEmployee ? 'Update employee details' : 'Enter details for the new employee'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Employee Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter employee name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Enter employee position"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Employee Color</Label>
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
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleSaveEmployee}>Save</Button>
          </CardFooter>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((employee) => (
          <Card key={employee.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <div className={cn(
                  "w-4 h-4 rounded-full",
                  employee.color?.split(' ')[0] || "bg-blue-100"
                )} />
                <CardTitle className="text-lg">{employee.name}</CardTitle>
              </div>
              <CardDescription>{employee.position}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-2">
              <div className="flex space-x-2 ml-auto">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEditEmployee(employee)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteEmployee(employee.id)}
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

export default EmployeeManagement;
