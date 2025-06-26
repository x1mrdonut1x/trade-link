import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Filter, Search } from 'lucide-react';

interface TaskFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
}

export const TaskFilters = ({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedType,
  onTypeChange,
}: TaskFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search tasks, descriptions, or related items..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Status: {selectedStatus === 'all' ? 'All' : selectedStatus}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => onStatusChange('all')}>
              All Statuses
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onStatusChange('pending')}>
              Pending
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onStatusChange('completed')}>
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onStatusChange('overdue')}>
              Overdue
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Type: {selectedType === 'all' ? 'All' : selectedType}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => onTypeChange('all')}>
              All Types
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onTypeChange('todo')}>
              To-Do
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onTypeChange('reminder')}>
              Reminder
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
