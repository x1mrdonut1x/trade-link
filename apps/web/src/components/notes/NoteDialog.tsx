import type { CreateNoteRequest, NoteWithRelationsDto, UpdateNoteRequest } from '@tradelink/shared';
import { Button } from '@tradelink/ui/components/button';
import { FormInput } from '@tradelink/ui/components/form-input';
import { Input } from '@tradelink/ui/components/input';
import { Textarea } from '@tradelink/ui/components/textarea';
import { useCreateNote, useUpdateNote } from 'api/notes';
import { useEffect, useState } from 'react';

interface NoteDialogProps {
  open: boolean;
  onClose: () => void;
  note?: NoteWithRelationsDto | null;
  contactId?: number;
  companyId?: number;
}

export function NoteDialog({ open, onClose, note, contactId, companyId }: NoteDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const createNoteMutation = useCreateNote({
    onSuccess: () => {
      onClose();
      resetForm();
    },
  });

  const updateNoteMutation = useUpdateNote({
    onSuccess: () => {
      onClose();
      resetForm();
    },
  });

  const resetForm = () => {
    setTitle('');
    setDescription('');
  };

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setDescription(note.description || '');
    } else {
      resetForm();
    }
  }, [note, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    if (note) {
      // Update existing note
      const updateData: UpdateNoteRequest = {
        title: title.trim(),
        description: description.trim() || null,
      };

      await updateNoteMutation.mutateAsync({
        id: note.id,
        data: updateData,
      });
    } else {
      // Create new note
      const createData: CreateNoteRequest = {
        title: title.trim(),
        description: description.trim() || null,
        contactId: contactId || null,
        companyId: companyId || null,
      };

      await createNoteMutation.mutateAsync(createData);
    }
  };

  const isLoading = createNoteMutation.isPending || updateNoteMutation.isPending;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">{note ? 'Edit Note' : 'Add Note'}</h2>
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
              placeholder="Enter note title"
              required
            />
          </FormInput>

          <FormInput label="Description">
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter note description (optional)"
              rows={4}
            />
          </FormInput>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading} disabled={!title.trim()}>
              {note ? 'Update Note' : 'Create Note'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
