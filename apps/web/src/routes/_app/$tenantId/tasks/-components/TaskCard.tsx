import { Link } from '@tanstack/react-router';
import type { TaskWithRelationsDto } from '@tradelink/shared';
import { Badge } from '@tradelink/ui/components/badge';
import { Button } from '@tradelink/ui/components/button';
import { Checkbox } from '@tradelink/ui/components/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@tradelink/ui/components/dropdown-menu';
import { Calendar, Edit, MoreHorizontal, Trash2, User } from '@tradelink/ui/icons';
import { CompanyIcon } from 'components/icons/CompanyIcon';
import { TaskIcon } from 'components/icons/TaskIcon';
import { useTenantParam } from 'hooks/use-tenant-param';

interface TaskCardProps {
  task: TaskWithRelationsDto;
  onToggleResolved: (task: TaskWithRelationsDto) => void;
  onEdit: (task: TaskWithRelationsDto) => void;
  onDelete: (task: TaskWithRelationsDto) => void;
}

export const TaskCard = ({ task, onToggleResolved, onEdit, onDelete }: TaskCardProps) => {
  const tenantId = useTenantParam();
  const getPriorityColor = (isOverdue: boolean, resolved: boolean) => {
    if (resolved) return 'bg-green-100 text-green-800';
    if (isOverdue) return 'bg-red-100 text-red-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getRelatedIcon = (task: TaskWithRelationsDto) => {
    if (task.company) return CompanyIcon;
    if (task.contact) return User;
    return TaskIcon;
  };

  const formatDate = (date?: string | Date | null) => {
    if (!date) return { text: 'No Date', isOverdue: false };

    const taskDate = new Date(date);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (taskDate < today) {
      return { text: 'Overdue', isOverdue: true };
    } else if (taskDate.getTime() === today.getTime()) {
      return { text: 'Today', isOverdue: false };
    } else {
      return { text: taskDate.toLocaleDateString(), isOverdue: false };
    }
  };

  const dateInfo = formatDate(task.reminderDate);
  const RelatedIcon = getRelatedIcon(task);

  return (
    <div className={`p-4 border rounded-lg bg-white shadow-sm ${task.resolved ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Checkbox checked={task.resolved} onCheckedChange={() => onToggleResolved(task)} className="mt-1" />

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className={`font-medium ${task.resolved ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </h3>
              <div className="flex items-center gap-1">
                <Badge variant="secondary" className={`text-xs ${getPriorityColor(dateInfo.isOverdue, task.resolved)}`}>
                  {task.resolved ? 'Completed' : dateInfo.isOverdue ? 'Overdue' : 'Pending'}
                </Badge>
              </div>
            </div>

            {task.description && (
              <p
                className={`text-sm ${task.resolved ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}
              >
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className={dateInfo.isOverdue && !task.resolved ? 'text-red-600 font-medium' : ''}>
                  {dateInfo.text}
                </span>
              </div>

              {task.contact && (
                <div className="flex items-center gap-1">
                  <RelatedIcon className="h-4 w-4" />
                  <Link
                    className="hover:underline"
                    to="/$tenantId/contacts/$contactId"
                    params={{ tenantId, contactId: task.contact?.id?.toString() }}
                  >
                    {`${task.contact.firstName} ${task.contact.lastName}`}
                  </Link>
                </div>
              )}
              {task.company && (
                <div className="flex items-center gap-1">
                  <CompanyIcon className="h-4 w-4" />
                  <Link
                    className="hover:underline"
                    to="/$tenantId/companies/$companyId"
                    params={{ tenantId, companyId: task.company?.id?.toString() }}
                  >
                    {task.company.name}
                  </Link>
                </div>
              )}

              {task.user && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>
                    Created by {task.user.firstName} {task.user.lastName}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleResolved(task)}>
              <TaskIcon className="h-4 w-4 mr-2" />
              {task.resolved ? 'Mark as Pending' : 'Mark as Completed'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(task)} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
