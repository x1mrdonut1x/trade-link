import { createFileRoute } from '@tanstack/react-router';
import { PlusCircle } from '@tradelink/ui/icons';
import { PageHeader } from 'components/page-header/PageHeader';
import { useState } from 'react';

import { mockTasks } from './-components/mockData';
import { TaskCard, type Task } from './-components/TaskCard';
import { TaskFilters } from './-components/TaskFilters';
import { TaskStats } from './-components/TaskStats';

export const Route = createFileRoute('/_app/tasks/')({
  component: TasksPage,
});

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.relatedTo.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    const matchesType = selectedType === 'all' || task.type === selectedType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(
      tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed, status: task.completed ? 'pending' : 'completed' } : task
      )
    );
  };

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
  };

  return (
    <>
      <PageHeader
        title="Tasks & Reminders"
        actions={[
          {
            label: 'Add Task',
            icon: PlusCircle,
            variant: 'default',
          },
        ]}
      />

      <TaskStats stats={taskStats} />

      <TaskFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      <div className="space-y-4">
        {filteredTasks.map(task => (
          <TaskCard key={task.id} task={task} onToggleCompletion={toggleTaskCompletion} />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No tasks found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first task.'}
          </p>
        </div>
      )}
    </>
  );
}
