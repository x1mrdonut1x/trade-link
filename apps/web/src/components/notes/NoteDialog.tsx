import { zodResolver } from '@hookform/resolvers/zod';
import { CreateNoteRequest, createNoteSchema, NoteWithRelationsDto } from '@tradelink/shared/notes';
import { Button } from '@tradelink/ui/components/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@tradelink/ui/components/dialog';
import { FormInput } from '@tradelink/ui/components/form-input';
import { Input } from '@tradelink/ui/components/input';
import { Textarea } from '@tradelink/ui/components/textarea';
import { useCreateNote, useUpdateNote } from 'api/notes';
import { useForm } from 'react-hook-form';

interface NoteDialogProps {
  open: boolean;
  onClose: () => void;
  note?: NoteWithRelationsDto;
  contactId?: number;
  companyId?: number;
}

export function NoteDialog({ open, onClose, note, contactId, companyId }: NoteDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CreateNoteRequest>({
    values: note,
    resolver: zodResolver(createNoteSchema),
    mode: 'onChange',
  });

  const createNoteMutation = useCreateNote({
    onSuccess: () => {
      onClose();
      reset();
    },
  });

  const updateNoteMutation = useUpdateNote({
    onSuccess: () => {
      onClose();
      reset();
    },
  });

  const onSubmit = (data: CreateNoteRequest) => {
    if (note?.id) {
      updateNoteMutation.mutate({ id: note.id, data });
    } else {
      createNoteMutation.mutate({ ...data, contactId: contactId, companyId: companyId });
    }
  };

  const isLoading = createNoteMutation.isPending || updateNoteMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{note ? 'Edit Note' : 'Add Note'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <FormInput label="Title" error={errors.title?.message}>
            <Input
              {...register('title')}
              id="title"
              placeholder="Enter note title"
              className={errors.title ? 'border-red-500' : ''}
            />
          </FormInput>

          <FormInput label="Description" error={errors.description?.message}>
            <Textarea
              {...register('description')}
              id="description"
              placeholder="Enter note description (optional)"
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
          </FormInput>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading} disabled={!isValid}>
              {note ? 'Update Note' : 'Create Note'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
