import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  AlertCircle,
  Bell,
  Building2,
  Calendar,
  CheckSquare,
  Clock,
  Edit,
  MoreHorizontal,
  Trash2,
  User,
} from 'lucide-react';

export interface Task {
  id: number;
  title: string;
  description: string;
  type: 'todo' | 'reminder';
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed' | 'overdue';
  dueDate: string;
  relatedTo: {
    type: 'company' | 'contact' | 'event';
    id: number;
    name: string;
  };
  createdAt: string;
  completed?: boolean;
}

interface TaskCardProps {
  task: Task;
  onToggleCompletion: (taskId: number) => void;
}

export const TaskCard = ({ task, onToggleCompletion }: TaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRelatedIcon = (type: string) => {
    switch (type) {
      case 'company':
        return Building2;
      case 'contact':
        return User;
      case 'event':
        return Calendar;
      default:
        return CheckSquare;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate: string, status: string) => {
    return status !== 'completed' && new Date(dueDate) < new Date();
  };

  const RelatedIcon = getRelatedIcon(task.relatedTo.type);

  return (
    <div className="p-4 border rounded-lg bg-card hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleCompletion(task.id)}
            className="mt-1"
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </h3>
              <div className="flex items-center space-x-2">
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
                <Badge className={getStatusColor(task.status)}>
                  {task.status}
                </Badge>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">{task.description}</p>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <RelatedIcon className="h-4 w-4" />
                  <span>{task.relatedTo.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {task.type === 'reminder' ? (
                    <Bell className="h-4 w-4" />
                  ) : (
                    <CheckSquare className="h-4 w-4" />
                  )}
                  <span className="capitalize">{task.type}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {isOverdue(task.dueDate, task.status) && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
                <Clock className="h-4 w-4" />
                <span>Due: {formatDate(task.dueDate)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
