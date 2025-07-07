import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, type CreateTaskRequest, type TaskWithRelationsDto } from '@tradelink/shared/tasks';
import { Button } from '@tradelink/ui/components/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@tradelink/ui/components/dialog';
import { FormInput } from '@tradelink/ui/components/form-input';
import { Input } from '@tradelink/ui/components/input';
import { Textarea } from '@tradelink/ui/components/textarea';
import { useCreateTask, useUpdateTask } from 'api/tasks';
import { useForm } from 'react-hook-form';

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  task?: TaskWithRelationsDto;
  contactId?: number;
  companyId?: number;
}

export function TaskDialog({ open, onClose, task, contactId, companyId }: TaskDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTaskRequest>({
    values: task,
    resolver: zodResolver(taskSchema.create),
    defaultValues: {
      reminderDate: undefined,
    },
  });

  const handleClose = () => {
    onClose();
    reset();
  };

  const createTaskMutation = useCreateTask({ onSuccess: handleClose });

  const updateTaskMutation = useUpdateTask({ onSuccess: handleClose });

  const onSubmit = (data: CreateTaskRequest) => {
    // Convert empty string to undefined for reminderDate
    const processedData = {
      ...data,
      reminderDate: data.reminderDate == '' || !data.reminderDate ? undefined : data.reminderDate,
    };

    if (task?.id) {
      updateTaskMutation.mutate({ id: task.id, data: processedData });
    } else {
      createTaskMutation.mutate({ ...processedData, contactId, companyId });
    }
  };

  const isLoading = createTaskMutation.isPending || updateTaskMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Add Task'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <FormInput label="Title" error={errors.title?.message}>
            <Input
              {...register('title')}
              id="title"
              placeholder="Enter Task title"
              className={errors.title ? 'border-red-500' : ''}
            />
          </FormInput>

          <FormInput label="Description" error={errors.description?.message}>
            <Textarea
              {...register('description')}
              id="description"
              placeholder="Enter Task description (optional)"
              rows={3}
              className={errors.description ? 'border-red-500' : ''}
            />
          </FormInput>

          <FormInput label="Reminder Date" error={errors.reminderDate?.message}>
            <Input
              {...register('reminderDate')}
              id="reminderDate"
              type="date"
              className={errors.reminderDate ? 'border-red-500' : ''}
            />
          </FormInput>

          {task && (
            <FormInput label="">
              <label className="flex items-center gap-2">
                <input {...register('resolved')} type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm">Mark as resolved</span>
              </label>
            </FormInput>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              {task ? 'Update task' : 'Create task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
