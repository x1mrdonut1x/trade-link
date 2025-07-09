import { createFileRoute } from '@tanstack/react-router';
import type { TaskWithRelationsDto } from '@tradelink/shared';
import { CheckSquare, PlusCircle } from '@tradelink/ui/icons';
import { useDeleteTask, useGetAllTasks, useResolveTask, useUnresolveTask } from 'api/tasks';
import { Empty } from 'components/empty/Empty';
import { PageHeader } from 'components/page-header/PageHeader';
import { TaskDialog } from 'components/tasks';
import { useState } from 'react';

import { useBreadcrumbSetup } from 'context/breadcrumb-context';
import { TaskCard } from './-components/TaskCard';
import { TaskFilters } from './-components/TaskFilters';
import { TaskStats } from './-components/TaskStats';

export const Route = createFileRoute('/_app/$tenantId/tasks/')({
  component: TasksPage,
});

function TasksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskWithRelationsDto>();

  useBreadcrumbSetup([{ title: 'Tasks', href: `/tasks`, isActive: true }]);

  const { data: tasks = [], isLoading } = useGetAllTasks({});

  // Mutations
  const resolveTaskMutation = useResolveTask();
  const unresolveTaskMutation = useUnresolveTask();
  const deleteTaskMutation = useDeleteTask();

  const handleToggleResolved = async (task: TaskWithRelationsDto) => {
    if (task.resolved) {
      unresolveTaskMutation.mutate(task.id);
    } else {
      resolveTaskMutation.mutate(task.id);
    }
  };

  const handleEditTask = (task: TaskWithRelationsDto) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleDeleteTask = async (task: TaskWithRelationsDto) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(task.id);
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

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => !t.resolved).length,
    completed: tasks.filter(t => t.resolved).length,
    overdue: tasks.filter(t => !t.resolved && new Date(t.reminderDate || '') < new Date()).length,
  };

  return (
    <>
      <div className="space-y-4 pb-4">
        <PageHeader
          title="Tasks & Reminders"
          actions={[
            {
              label: 'Add Task',
              icon: PlusCircle,
              variant: 'default',
              onClick: handleCreateTask,
            },
          ]}
        />

        <TaskStats stats={taskStats} />

        <TaskFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
      </div>
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">Loading tasks...</div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleResolved={handleToggleResolved}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ))
        )}
      </div>

      {!isLoading && tasks.length === 0 && (
        <Empty
          icon={CheckSquare}
          title="No tasks found"
          description={searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first task.'}
        />
      )}

      <TaskDialog open={isDialogOpen} onClose={handleCloseDialog} task={editingTask} />
    </>
  );
}
