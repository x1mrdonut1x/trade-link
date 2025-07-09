import type { GetEventResponse } from '@tradelink/shared';
import { Button } from '@tradelink/ui/components/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@tradelink/ui/components/dialog';
import { useUpdateEvent } from 'api/events/hooks';
import { useState } from 'react';
import { ParticipantsForm } from './ParticipantsForm';

interface AddParticipantsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: GetEventResponse;
}

export function AddParticipantsDialog({ open, onOpenChange, event }: AddParticipantsDialogProps) {
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<number[]>(
    event.companies?.map(company => company.id) || []
  );
  const [selectedContactIds, setSelectedContactIds] = useState<number[]>(
    event.contacts?.map(contact => contact.id) || []
  );

  const updateEvent = useUpdateEvent({
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  const handleSave = () => {
    updateEvent.mutate({
      id: event.id,
      data: {
        companyIds: selectedCompanyIds,
        contactIds: selectedContactIds,
      },
    });
  };

  const handleCancel = () => {
    // Reset to original state
    setSelectedCompanyIds(event.companies?.map(company => company.id) || []);
    setSelectedContactIds(event.contacts?.map(contact => contact.id) || []);
    onOpenChange(false);
  };

  const hasChanges =
    JSON.stringify(selectedCompanyIds.sort()) !== JSON.stringify((event.companies?.map(c => c.id) || []).sort()) ||
    JSON.stringify(selectedContactIds.sort()) !== JSON.stringify((event.contacts?.map(c => c.id) || []).sort());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Event Participants</DialogTitle>
        </DialogHeader>

        <ParticipantsForm
          selectedCompanyIds={selectedCompanyIds}
          selectedContactIds={selectedContactIds}
          onCompanyIdsChange={setSelectedCompanyIds}
          onContactIdsChange={setSelectedContactIds}
          event={event}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={updateEvent.isPending}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} loading={updateEvent.isPending} disabled={!hasChanges}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
