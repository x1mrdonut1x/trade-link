import type { CreateTodoRequest, TodoWithRelationsDto, UpdateTodoRequest } from '@tradelink/shared';
import { Button } from '@tradelink/ui/components/button';
import { FormInput } from '@tradelink/ui/components/form-input';
import { Input } from '@tradelink/ui/components/input';
import { Textarea } from '@tradelink/ui/components/textarea';
import { useCreateTodo, useUpdateTodo } from 'api/todos';
import { useEffect, useState } from 'react';

interface TodoDialogProps {
  open: boolean;
  onClose: () => void;
  todo?: TodoWithRelationsDto | null;
  contactId?: number;
  companyId?: number;
}

export function TodoDialog({ open, onClose, todo, contactId, companyId }: TodoDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [resolved, setResolved] = useState(false);

  const createTodoMutation = useCreateTodo({
    onSuccess: () => {
      onClose();
      resetForm();
    },
  });

  const updateTodoMutation = useUpdateTodo({
    onSuccess: () => {
      onClose();
      resetForm();
    },
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setReminderDate('');
    setResolved(false);
  };

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || '');
      // Format date to YYYY-MM-DD for input
      const date = new Date(todo.reminderDate);
      setReminderDate(date.toISOString().split('T')[0]);
      setResolved(todo.resolved);
    } else {
      resetForm();
    }
  }, [todo, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !reminderDate) return;

    if (todo) {
      // Update existing item
      const updateData: UpdateTodoRequest = {
        title: title.trim(),
        description: description.trim() || null,
        reminderDate: new Date(reminderDate),
        resolved,
      };

      await updateTodoMutation.mutateAsync({
        id: todo.id,
        data: updateData,
      });
    } else {
      // Create new item
      const createData: CreateTodoRequest = {
        title: title.trim(),
        description: description.trim() || null,
        reminderDate: new Date(reminderDate),
        resolved,
        contactId: contactId || null,
        companyId: companyId || null,
      };

      await createTodoMutation.mutateAsync(createData);
    }
  };

  const isLoading = createTodoMutation.isPending || updateTodoMutation.isPending;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">{todo ? 'Edit TODO' : 'Add TODO'}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            ×
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <FormInput label="Title">
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter TODO title"
              required
            />
          </FormInput>

          <FormInput label="Description">
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter TODO description (optional)"
              rows={3}
            />
          </FormInput>

          <FormInput label="Reminder Date">
            <Input
              id="reminderDate"
              type="date"
              value={reminderDate}
              onChange={e => setReminderDate(e.target.value)}
              required
            />
          </FormInput>

          {todo && (
            <FormInput label="">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={resolved}
                  onChange={e => setResolved(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Mark as resolved</span>
              </label>
            </FormInput>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading} disabled={!title.trim() || !reminderDate}>
              {todo ? 'Update TODO' : 'Create TODO'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
