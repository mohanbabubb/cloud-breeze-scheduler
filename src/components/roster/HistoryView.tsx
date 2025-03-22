
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { HistoryEntry, getHistoryEntries } from '@/utils/historyHelpers';
import { Badge } from '@/components/ui/badge';
import { Clock, History } from 'lucide-react';

export function HistoryView() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  
  useEffect(() => {
    // Get history entries
    setHistory(getHistoryEntries());
    
    // Set up interval to refresh history every few seconds
    const interval = setInterval(() => {
      setHistory(getHistoryEntries());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-muted/20 rounded-lg">
        <History className="h-12 w-12 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">No History Yet</h3>
        <p className="text-muted-foreground text-center max-w-md mt-1">
          Changes to employee shifts will be recorded here. Try creating, 
          updating, or deleting shifts to see the history.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <History className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Shift Change History</h2>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Time</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Counter</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className="hidden md:table-cell">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="whitespace-nowrap font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {format(entry.timestamp, 'MMM d, h:mm a')}
                  </div>
                </TableCell>
                <TableCell>{entry.employeeName}</TableCell>
                <TableCell>{entry.counterName}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      entry.actionType === "create" 
                        ? "outline" 
                        : entry.actionType === "update" 
                          ? "secondary" 
                          : "destructive"
                    }
                    className="font-normal"
                  >
                    {entry.actionType === "create" 
                      ? "Created" 
                      : entry.actionType === "update" 
                        ? "Updated" 
                        : "Deleted"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {entry.details}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default HistoryView;
