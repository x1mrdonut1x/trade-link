import type { GetEventResponse } from '@tradelink/shared/events';
import { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ParticipantsForm } from './ParticipantsForm';

interface EventParticipantsSectionProps {
  form: UseFormReturn<any>;
  event?: GetEventResponse;
}

export function EventParticipantsSection({ form, event }: EventParticipantsSectionProps) {
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<number[]>([]);
  const [selectedContactIds, setSelectedContactIds] = useState<number[]>([]);

  // Initialize state with form values
  useEffect(() => {
    const companyIds = form.watch('companyIds') || [];
    const contactIds = form.watch('contactIds') || [];
    setSelectedCompanyIds(companyIds);
    setSelectedContactIds(contactIds);
  }, [form]);

  const handleCompanyIdsChange = (companyIds: number[]) => {
    setSelectedCompanyIds(companyIds);
    form.setValue('companyIds', companyIds);
  };

  const handleContactIdsChange = (contactIds: number[]) => {
    setSelectedContactIds(contactIds);
    form.setValue('contactIds', contactIds);
  };

  return (
    <ParticipantsForm
      selectedCompanyIds={selectedCompanyIds}
      selectedContactIds={selectedContactIds}
      onCompanyIdsChange={handleCompanyIdsChange}
      onContactIdsChange={handleContactIdsChange}
      event={event}
    />
  );
}
