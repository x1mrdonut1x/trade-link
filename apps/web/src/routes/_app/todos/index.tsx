import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { type GetAllTodosResponse } from '@tradelink/shared';
import { todoSchema } from '@tradelink/shared/todos/todos.request';
import { Badge } from '@tradelink/ui/components/badge';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent } from '@tradelink/ui/components/card';
import { DataTable, type Column } from '@tradelink/ui/components/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@tradelink/ui/components/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@tradelink/ui/components/select';
import { Calendar, CheckCircle, Circle, Edit, Ellipsis, PlusCircle, Trash2 } from '@tradelink/ui/icons';
import { useDeleteTodo, useGetAllTodos, useResolveTodo, useUnresolveTodo } from 'api/todos';
import { PageHeader } from 'components/page-header/PageHeader';
import { TodoDialog } from 'components/todos';
import { useBreadcrumbSetup } from 'context/breadcrumb-context';
import { useState } from 'react';

export const Route = createFileRoute('/_app/todos/')({
  validateSearch: zodValidator(todoSchema.getAllQuery),
  component: Todos,
});

function Todos() {
  const { status, contactId, companyId } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<GetAllTodosResponse[0] | null>(null);

  useBreadcrumbSetup([{ title: 'TODOs', href: '/todos', isActive: true }]);

  const { data: todos = [], isLoading } = useGetAllTodos({ status, contactId, companyId });
  const deleteTodoMutation = useDeleteTodo();
  const resolveTodoMutation = useResolveTodo();
  const unresolveTodoMutation = useUnresolveTodo();

  const handleStatusFilter = (newStatus: string) => {
    const statusValue = newStatus === 'all' ? undefined : (newStatus as 'pending' | 'resolved' | 'upcoming');
    navigate({ search: { status: statusValue, contactId, companyId } });
  };

  const handleToggleResolved = async (todo: GetAllTodosResponse[0]) => {
    if (todo.resolved) {
      await unresolveTodoMutation.mutateAsync(todo.id);
    } else {
      await resolveTodoMutation.mutateAsync(todo.id);
    }
  };

  const handleEditTodo = (todo: GetAllTodosResponse[0]) => {
    setEditingTodo(todo);
    setIsDialogOpen(true);
  };

  const handleDeleteTodo = async (todo: GetAllTodosResponse[0]) => {
    if (confirm('Are you sure you want to delete this TODO?')) {
      await deleteTodoMutation.mutateAsync(todo.id);
    }
  };

  const handleCreateTodo = () => {
    setEditingTodo(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTodo(null);
  };

  const formatDate = (date: string | Date) => {
    const todoDate = new Date(date);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (todoDate < today) {
      return 'Overdue';
    } else if (todoDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (todoDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return todoDate.toLocaleDateString();
    }
  };

  const getDateColor = (date: string | Date, resolved: boolean) => {
    if (resolved) return 'text-green-600';

    const todoDate = new Date(date);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (todoDate < today) {
      return 'text-red-600';
    } else if (todoDate.getTime() === today.getTime()) {
      return 'text-orange-600';
    } else {
      return 'text-blue-600';
    }
  };

  const columns: Column<GetAllTodosResponse[0]>[] = [
    {
      title: '',
      render: todo => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleToggleResolved(todo)}
          className="h-6 w-6 p-0"
          disabled={resolveTodoMutation.isPending || unresolveTodoMutation.isPending}
        >
          {todo.resolved ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
      ),
    },
    {
      title: 'Title',
      sortable: true,
      render: todo => (
        <div>
          <div className={`font-medium ${todo.resolved ? 'line-through text-muted-foreground' : ''}`}>{todo.title}</div>
          {todo.description && (
            <div className={`text-sm text-muted-foreground mt-1 ${todo.resolved ? 'line-through' : ''}`}>
              {todo.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Due Date',
      sortable: true,
      render: todo => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className={getDateColor(todo.reminderDate, todo.resolved)}>{formatDate(todo.reminderDate)}</span>
        </div>
      ),
    },
    {
      title: 'Associated With',
      render: todo => (
        <div className="flex flex-wrap gap-1">
          {todo.contact && (
            <Badge variant="secondary" className="text-xs">
              Contact: {todo.contact.firstName} {todo.contact.lastName}
            </Badge>
          )}
          {todo.company && (
            <Badge variant="secondary" className="text-xs">
              Company: {todo.company.name}
            </Badge>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      sortable: true,
      render: todo => (
        <Badge variant={todo.resolved ? 'default' : 'secondary'} className="text-xs">
          {todo.resolved ? 'Resolved' : 'Pending'}
        </Badge>
      ),
    },
    {
      title: 'Created By',
      render: todo => (
        <div className="text-sm">
          {todo.user?.firstName} {todo.user?.lastName}
        </div>
      ),
    },
    {
      title: 'Actions',
      render: todo => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEditTodo(todo)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleToggleResolved(todo)}
              disabled={resolveTodoMutation.isPending || unresolveTodoMutation.isPending}
            >
              {todo.resolved ? (
                <>
                  <Circle className="mr-2 h-4 w-4" />
                  Mark as Pending
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Resolved
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteTodo(todo)} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="TODOs"
        actions={[
          {
            label: 'Add TODO',
            icon: PlusCircle,
            variant: 'default',
            onClick: handleCreateTodo,
          },
        ]}
      />

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Filter by status:</span>
              <Select value={status || 'all'} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All TODOs</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={todos}
            loading={isLoading}
            emptyMessage="No TODOs found"
            onRowClick={() => {}} // TODOs don't have detail pages, so no click action
          />
        </CardContent>
      </Card>

      <TodoDialog open={isDialogOpen} onClose={handleCloseDialog} todo={editingTodo} />
    </>
  );
}
