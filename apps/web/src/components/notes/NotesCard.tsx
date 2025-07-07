import type { NoteWithRelationsDto } from '@tradelink/shared';
import { Badge } from '@tradelink/ui/components/badge';
import { Button } from '@tradelink/ui/components/button';
import { Card } from '@tradelink/ui/components/card';
import { Separator } from '@tradelink/ui/components/separator';
import { Edit, MessageSquare, Plus, Trash2 } from '@tradelink/ui/icons';
import { useDeleteNote, useGetAllNotes } from 'api/notes';
import { useState } from 'react';

import { NoteDialog } from './NoteDialog';

interface NotesCardProps {
  contactId?: number;
  companyId?: number;
  title?: string;
  showTag?: boolean;
}

export function NotesCard({ contactId, companyId, title = 'Notes', showTag = false }: NotesCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteWithRelationsDto>();

  const { data: notes = [], isLoading, error } = useGetAllNotes({ contactId, companyId });

  const deleteNoteMutation = useDeleteNote({
    onSuccess: () => {
      // Notes will be automatically refetched due to query invalidation
    },
  });

  const handleEditNote = (note: NoteWithRelationsDto) => {
    setEditingNote(note);
    setIsDialogOpen(true);
  };

  const handleDeleteNote = async (noteId: number) => {
    if (confirm('Are you sure you want to delete this note?')) {
      await deleteNoteMutation.mutateAsync(noteId);
    }
  };

  const handleCreateNote = () => {
    setEditingNote(undefined);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingNote(undefined);
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const noteDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - noteDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}mo ago`;

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears}y ago`;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
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
            <MessageSquare className="h-5 w-5 mr-2" />
            {title}
          </h3>
        </div>
        <div className="text-center py-4">
          <p className="text-red-600">Failed to load notes</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            {title}
          </h3>
          <Button size="sm" variant="outline" onClick={handleCreateNote}>
            <Plus className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium mb-2">No notes yet</h4>
            <p className="text-muted-foreground mb-4">Start by adding your first note.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note, index) => (
              <div key={note.id}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{note.title}</h4>
                      {note.contactId && showTag && (
                        <Badge variant="secondary" className="text-xs">
                          Contact
                        </Badge>
                      )}
                      {note.companyId && showTag && (
                        <Badge variant="secondary" className="text-xs">
                          Company
                        </Badge>
                      )}
                    </div>
                    {note.description && (
                      <p
                        className="text-muted-foreground text-sm mb-2 overflow-hidden"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {note.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        By {note.user?.firstName} {note.user?.lastName}
                      </span>
                      <span>•</span>
                      <span>{formatTimeAgo(note.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => handleEditNote(note)} className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNote(note.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      disabled={deleteNoteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {index < notes.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        )}
      </Card>

      <NoteDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        note={editingNote}
        contactId={contactId}
        companyId={companyId}
      />
    </>
  );
}
