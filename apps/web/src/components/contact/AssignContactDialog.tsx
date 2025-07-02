import { useState } from 'react';
import { Button } from '@tradelink/ui/components/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@tradelink/ui/components/dialog';
import { Combobox, type ComboboxOption } from '@tradelink/ui/components/combobox';
import { Separator } from '@tradelink/ui/components/separator';
import { useGetAllContacts } from 'api/contact/hooks';
import { useUpdateContact } from 'api/contact/hooks';
import { ContactForm } from './ContactForm';
import { UserPlus, Users } from 'lucide-react';

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

  const { data: contacts = [] } = useGetAllContacts();
  const updateContactMutation = useUpdateContact({
    onSuccess: (data) => {
      setOpen(false);
      onContactAssigned?.(data.id);
      setSelectedContactId('');
    },
  });

  // Filter out contacts that are already assigned to this company
  const availableContacts = contacts.filter(contact => contact.companyId !== companyId);
  
  const contactOptions: ComboboxOption[] = availableContacts.map((contact) => ({
    value: contact.id.toString(),
    label: `${contact.firstName} ${contact.lastName} (${contact.email})`,
  }));

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Contact to Company</DialogTitle>
        </DialogHeader>
        
        {mode === 'select' ? (
          <div className="space-y-6">
            {/* Mode Selection */}
            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={() => setMode('select')}
                className="flex-1"
              >
                <Users className="h-4 w-4 mr-2" />
                Select Existing
              </Button>
              <Button
                variant="outline"
                onClick={() => setMode('create')}
                className="flex-1"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </div>

            <Separator />

            {/* Select Existing Contact */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Select an existing contact</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose a contact that is not currently assigned to any company.
                </p>
              </div>
              
              <Combobox
                options={contactOptions}
                value={selectedContactId}
                onValueChange={setSelectedContactId}
                placeholder="Search and select a contact..."
                searchPlaceholder="Type to search contacts..."
                emptyText={availableContacts.length === 0 ? "No available contacts found." : "No contacts match your search."}
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSelectExisting}
                  disabled={!selectedContactId || updateContactMutation.isPending}
                >
                  {updateContactMutation.isPending ? 'Assigning...' : 'Assign Contact'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Mode Selection */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setMode('select')}
                className="flex-1"
              >
                <Users className="h-4 w-4 mr-2" />
                Select Existing
              </Button>
              <Button
                variant="default"
                onClick={() => setMode('create')}
                className="flex-1"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </div>

            <Separator />

            {/* Create New Contact */}
            <div>
              <h3 className="text-lg font-medium mb-2">Create a new contact</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The contact will be automatically assigned to this company.
              </p>
            </div>

            <ContactForm 
              defaultCompanyId={companyId}
              onSuccess={handleCreateNew}
              onCancel={handleCancel}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
