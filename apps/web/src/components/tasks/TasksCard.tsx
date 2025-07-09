import type { TaskWithRelationsDto } from '@tradelink/shared';
import { Badge } from '@tradelink/ui/components/badge';
import { Button } from '@tradelink/ui/components/button';
import { Card } from '@tradelink/ui/components/card';
import { Separator } from '@tradelink/ui/components/separator';
import { CheckCircle, Circle, Edit, Plus, Trash2 } from '@tradelink/ui/icons';
import { useDeleteTask, useGetAllTasks, useResolveTask, useUnresolveTask } from 'api/tasks';
import { useState } from 'react';

import { TaskIcon } from 'components/icons/TaskIcon';
import { TaskDialog } from './TaskDialog';

interface TasksCardProps {
  contactId?: number;
  companyId?: number;
  title?: string;
  showTag?: boolean;
}

export function TasksCard({ contactId, companyId, title = 'Tasks', showTag = false }: TasksCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithRelationsDto>();

  const { data: tasks = [], isLoading, error } = useGetAllTasks({ contactId, companyId });

  const deleteTaskMutation = useDeleteTask();
  const resolveTaskMutation = useResolveTask();
  const unresolveTaskMutation = useUnresolveTask();

  const handleEditTask = (task: TaskWithRelationsDto) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleDeleteTask = async (taskId: number) => {
    if (confirm('Are you sure you want to delete this Task?')) {
      await deleteTaskMutation.mutateAsync(taskId);
    }
  };

  const handleToggleResolved = (task: Pick<TaskWithRelationsDto, 'resolved' | 'id'>) => {
    if (task.resolved) {
      unresolveTaskMutation.mutate(task.id);
    } else {
      resolveTaskMutation.mutate(task.id);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTask(undefined);
  };

  const formatDate = (date: string) => {
    if (!date) return;

    const taskDate = new Date(date);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (taskDate < today) {
      return 'Overdue';
    } else if (taskDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (taskDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return taskDate.toLocaleDateString();
    }
  };

  const getDateColor = (date: string, resolved: boolean) => {
    if (!date) return 'text-muted-foreground';
    if (resolved) return 'text-green-600';

    const taskDate = new Date(date);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (taskDate < today) {
      return 'text-red-600';
    } else if (taskDate.getTime() === today.getTime()) {
      return 'text-orange-600';
    } else {
      return 'text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <TaskIcon className="h-5 w-5 mr-2" />
            {title}
          </h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <TaskIcon className="h-5 w-5 mr-2" />
            {title}
          </h3>
        </div>
        <div className="text-center py-4">
          <p className="text-red-600">Failed to load tasks</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <TaskIcon className="h-5 w-5 mr-2" />
            {title}
          </h3>
          <Button size="sm" variant="outline" onClick={handleCreateTask}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <TaskIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium mb-2">No Tasks yet</h4>
            <p className="text-muted-foreground mb-4">Start by adding your first Task.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task, index) => (
              <div key={task.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleResolved(task)}
                      className="h-6 w-6 p-0 mt-1"
                      disabled={resolveTaskMutation.isPending || unresolveTaskMutation.isPending}
                    >
                      {task.resolved ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className={`font-medium ${task.resolved ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </h4>
                        {task.contactId && showTag && (
                          <Badge variant="secondary" className="text-xs">
                            Contact
                          </Badge>
                        )}
                        {task.companyId && showTag && (
                          <Badge variant="secondary" className="text-xs">
                            Company
                          </Badge>
                        )}
                        {task.resolved && (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                            Resolved
                          </Badge>
                        )}
                      </div>
                      {task.description && (
                        <p
                          className={`text-sm mb-2 overflow-hidden ${
                            task.resolved ? 'text-muted-foreground line-through' : 'text-muted-foreground'
                          }`}
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs">
                        {task.reminderDate && (
                          <span className={getDateColor(task.reminderDate, task.resolved)}>
                            <TaskIcon className="h-3 w-3 inline mr-1" />
                            {formatDate(task.reminderDate)}
                          </span>
                        )}
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          By {task.user?.firstName} {task.user?.lastName}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => handleEditTask(task)} className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      disabled={deleteTaskMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {index < tasks.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        )}
      </Card>

      <TaskDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        task={editingTask}
        contactId={contactId}
        companyId={companyId}
      />
    </>
  );
}
