import { Button } from '@tradelink/ui/components/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@tradelink/ui/components/dialog';
import { Separator } from '@tradelink/ui/components/separator';
import { UserPlus, Users } from '@tradelink/ui/icons';
import { useUpdateContact } from 'api/contact/hooks';
import { useState } from 'react';
import { ContactSelector } from '../contact-selector/ContactSelector';
import { ContactForm } from './ContactForm';

interface AssignContactDialogProps {
  companyId: number;
  onContactAssigned?: (contactId: number) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AssignContactDialog({ companyId, onContactAssigned, open: controlledOpen, onOpenChange }: AssignContactDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [mode, setMode] = useState<'select' | 'create'>('select');
  const [selectedContactId, setSelectedContactId] = useState<string>('');

  // Use controlled or uncontrolled state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const updateContactMutation = useUpdateContact({
    onSuccess: data => {
      setOpen(false);
      onContactAssigned?.(data.id);
      setSelectedContactId('');
    },
  });

  const handleSelectExisting = () => {
    if (!selectedContactId) return;

    updateContactMutation.mutate({
      id: Number(selectedContactId),
      data: { companyId },
    });
  };

  const handleCreateNew = (contactId: number) => {
    setOpen(false);
    onContactAssigned?.(contactId);
  };

  const handleCancel = () => {
    setOpen(false);
    setMode('select');
    setSelectedContactId('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {controlledOpen === undefined && (
        <DialogTrigger asChild>
          <Button variant="outline">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Contact to Company</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mode Selection */}
          <div className="flex gap-2 flex-col sm:flex-row">
            <Button variant={mode === 'select' ? 'default' : 'outline'} onClick={() => setMode('select')} className="flex-1">
              <Users className="h-4 w-4 mr-2" />
              Select Existing
            </Button>
            <Button variant={mode === 'select' ? 'outline' : 'default'} onClick={() => setMode('create')} className="flex-1">
              <UserPlus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </div>

          <Separator />

          {mode === 'select' ? (
            <>
              {/* Select Existing Contact */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Select an existing contact</h3>
                  <p className="text-sm text-muted-foreground mb-4">Choose a contact that is not currently assigned to any company.</p>
                </div>

                <ContactSelector
                  value={selectedContactId}
                  onValueChange={setSelectedContactId}
                  placeholder="Search and select a contact..."
                  searchPlaceholder="Type to search contacts..."
                  emptyText="No available contacts found."
                  excludeCompanyId={companyId}
                />

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSelectExisting} disabled={!selectedContactId} loading={updateContactMutation.isPending}>
                    Assign Contact
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Create New Contact */}
              <div>
                <h3 className="text-lg font-medium mb-2">Create a new contact</h3>
                <p className="text-sm text-muted-foreground mb-4">The contact will be automatically assigned to this company.</p>
              </div>

              <ContactForm defaultCompanyId={companyId} onSuccess={handleCreateNew} onCancel={handleCancel} />
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
