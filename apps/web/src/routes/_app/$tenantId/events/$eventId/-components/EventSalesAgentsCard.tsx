import type { ContactEventDto } from '@tradelink/shared';
import { ContactIcon } from 'components/icons/ContactIcon';
import { GenericParticipantsCard } from './GenericParticipantsCard';

interface EventSalesAgentsCardProps {
  agents: ContactEventDto[];
  onAddContact?: () => void;
}

export const EventSalesAgentsCard = ({ agents, onAddContact }: EventSalesAgentsCardProps) => {
  return (
    <GenericParticipantsCard
      title="Contacts"
      icon={<ContactIcon className="h-5 w-5 mr-2" />}
      items={agents}
      onAddItem={onAddContact}
      renderItem={agent => (
        <div>
          <p className="font-medium">
            {agent.firstName} {agent.lastName}
          </p>
          <p className="text-sm text-muted-foreground">
            {agent.jobTitle && `${agent.jobTitle} • `}
            {agent.companyName || 'No company'}
          </p>
          <p className="text-sm text-muted-foreground">{agent.email}</p>
        </div>
      )}
      emptyMessage="No contacts assigned to this event yet."
      addButtonText="Add"
    />
  );
};
