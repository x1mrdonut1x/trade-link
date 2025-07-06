import type { TodoWithRelationsDto } from '@tradelink/shared';
import { Badge } from '@tradelink/ui/components/badge';
import { Button } from '@tradelink/ui/components/button';
import { Card } from '@tradelink/ui/components/card';
import { Separator } from '@tradelink/ui/components/separator';
import { Calendar, CheckCircle, Circle, Edit, Plus, Trash2 } from '@tradelink/ui/icons';
import {
  useDeleteTodo,
  useGetTodosByCompanyId,
  useGetTodosByContactId,
  useResolveTodo,
  useUnresolveTodo,
} from 'api/todos';
import { useState } from 'react';

import { TodoDialog } from './TodoDialog';

interface TodosCardProps {
  contactId?: number;
  companyId?: number;
  title?: string;
  showTag?: boolean;
}

export function TodosCard({ contactId, companyId, title = 'TODOs', showTag = false }: TodosCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoWithRelationsDto | null>(null);

  // Always call both hooks but disable the one we don't need
  const contactTodosQuery = useGetTodosByContactId(contactId || 0);
  const companyTodosQuery = useGetTodosByCompanyId(companyId || 0);

  // Use the appropriate query based on what ID was provided
  const todosQuery = contactId ? contactTodosQuery : companyTodosQuery;
  const { data: todos = [], isLoading, error } = todosQuery;

  const deleteTodoMutation = useDeleteTodo({
    onSuccess: () => {
      // TODOs will be automatically refetched due to query invalidation
    },
  });

  const resolveTodoMutation = useResolveTodo({
    onSuccess: () => {
      // TODOs will be automatically refetched due to query invalidation
    },
  });

  const unresolveTodoMutation = useUnresolveTodo({
    onSuccess: () => {
      // TODOs will be automatically refetched due to query invalidation
    },
  });

  const handleEditTodo = (todo: TodoWithRelationsDto) => {
    setEditingTodo(todo);
    setIsDialogOpen(true);
  };

  const handleDeleteTodo = async (todoId: number) => {
    if (confirm('Are you sure you want to delete this TODO?')) {
      await deleteTodoMutation.mutateAsync(todoId);
    }
  };

  const handleToggleResolved = async (todo: TodoWithRelationsDto) => {
    if (todo.resolved) {
      await unresolveTodoMutation.mutateAsync(todo.id);
    } else {
      await resolveTodoMutation.mutateAsync(todo.id);
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
      return 'text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
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
            <Calendar className="h-5 w-5 mr-2" />
            {title}
          </h3>
        </div>
        <div className="text-center py-4">
          <p className="text-red-600">Failed to load TODOs</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            {title}
          </h3>
          <Button size="sm" onClick={handleCreateTodo}>
            <Plus className="h-4 w-4 mr-2" />
            Add TODO
          </Button>
        </div>

        {todos.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium mb-2">No TODOs yet</h4>
            <p className="text-muted-foreground mb-4">Start by adding your first TODO.</p>
            <Button onClick={handleCreateTodo}>
              <Plus className="h-4 w-4 mr-2" />
              Add TODO
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {todos.map((todo, index) => (
              <div key={todo.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleResolved(todo)}
                      className="h-6 w-6 p-0 mt-1"
                      disabled={resolveTodoMutation.isPending || unresolveTodoMutation.isPending}
                    >
                      {todo.resolved ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className={`font-medium ${todo.resolved ? 'line-through text-muted-foreground' : ''}`}>
                          {todo.title}
                        </h4>
                        {todo.contactId && showTag && (
                          <Badge variant="secondary" className="text-xs">
                            Contact
                          </Badge>
                        )}
                        {todo.companyId && showTag && (
                          <Badge variant="secondary" className="text-xs">
                            Company
                          </Badge>
                        )}
                        {todo.resolved && (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                            Resolved
                          </Badge>
                        )}
                      </div>
                      {todo.description && (
                        <p
                          className={`text-sm mb-2 overflow-hidden ${
                            todo.resolved ? 'text-muted-foreground line-through' : 'text-muted-foreground'
                          }`}
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {todo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs">
                        <span className={getDateColor(todo.reminderDate, todo.resolved)}>
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {formatDate(todo.reminderDate)}
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">
                          By {todo.user?.firstName} {todo.user?.lastName}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => handleEditTodo(todo)} className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      disabled={deleteTodoMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {index < todos.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        )}
      </Card>

      <TodoDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        todo={editingTodo}
        contactId={contactId}
        companyId={companyId}
      />
    </>
  );
}
