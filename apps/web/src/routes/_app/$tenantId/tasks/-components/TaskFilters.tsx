import { Button } from '@tradelink/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@tradelink/ui/components/dropdown-menu';
import { Input } from '@tradelink/ui/components/input';
import { Filter, Search } from '@tradelink/ui/icons';

interface TaskFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
}

export const TaskFilters = ({ searchTerm, onSearchChange, selectedStatus, onStatusChange }: TaskFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search tasks, descriptions, or related items..."
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
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
            <DropdownMenuItem onSelect={() => onStatusChange('all')}>All Statuses</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onStatusChange('pending')}>Pending</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onStatusChange('completed')}>Completed</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onStatusChange('overdue')}>Overdue</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
