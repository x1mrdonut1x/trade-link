import { zodResolver } from '@hookform/resolvers/zod';
import { tagSchema, type TagDto } from '@tradelink/shared/tags';
import { Button } from '@tradelink/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@tradelink/ui/components/dialog';
import { Input } from '@tradelink/ui/components/input';
import { Label } from '@tradelink/ui/components/label';
import { useCreateTag, useUpdateTag } from 'api/tags';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface TagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: TagDto;
}

function generateRandomColor(): string {
  const colors = [
    '#3B82F6',
    '#EF4444',
    '#10B981',
    '#F59E0B',
    '#8B5CF6',
    '#EC4899',
    '#06B6D4',
    '#84CC16',
    '#F97316',
    '#6366F1',
    '#14B8A6',
    '#F43F5E',
    '#8B5A2B',
    '#6B7280',
    '#059669',
    '#DC2626',
    '#7C3AED',
    '#DB2777',
    '#0891B2',
    '#65A30D',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function TagDialog({ open, onOpenChange, tag }: TagDialogProps) {
  const isEditing = !!tag?.id;
  const [error, setError] = useState<string>();

  const createTag = useCreateTag({
    onError: error => setError(error.message),
    onSuccess: () => handleClose(),
  });
  const updateTag = useUpdateTag({
    onError: error => setError(error.message),
    onSuccess: () => handleClose(),
  });

  const handleClose = () => {
    onOpenChange(false);
    setError(undefined);
  };

  const form = useForm({
    resolver: zodResolver(tagSchema.create),
    values: tag,
    defaultValues: { name: '', color: generateRandomColor() },
  });

  const onSubmit = form.handleSubmit(async data => {
    if (isEditing) {
      updateTag.mutate({ id: tag.id, ...data });
    } else {
      createTag.mutate(data);
    }
  });

  const handleRandomColor = () => {
    form.setValue('color', generateRandomColor());
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Tag' : 'Create New Tag'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update tag details below.' : 'Create a new tag to organize your contacts and companies.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter tag name" {...form.register('name')} />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex items-center gap-2">
              <input
                id="color"
                type="color"
                className="w-12 h-10 border rounded-md cursor-pointer"
                {...form.register('color')}
              />
              <Input placeholder={form.watch('color')} className="flex-1" {...form.register('color')} />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRandomColor}
                className="whitespace-nowrap"
              >
                Random
              </Button>
            </div>
            {form.formState.errors.color && (
              <p className="text-sm text-destructive">{form.formState.errors.color.message}</p>
            )}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createTag.isPending || updateTag.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" loading={createTag.isPending || updateTag.isPending}>
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
