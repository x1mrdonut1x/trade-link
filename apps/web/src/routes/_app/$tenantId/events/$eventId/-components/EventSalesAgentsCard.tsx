import type { ContactEventDto } from '@tradelink/shared';
import { Button } from '@tradelink/ui/components/button';
import { UserPlus } from '@tradelink/ui/icons';

interface EventSalesAgentsCardProps {
  agents: ContactEventDto[];
  onAddContact?: () => void;
}

export const EventSalesAgentsCard = ({ agents, onAddContact }: EventSalesAgentsCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Contacts ({agents.length})</h3>
        {onAddContact && (
          <Button variant="outline" size="sm" onClick={onAddContact}>
            <UserPlus className="h-4 w-4 mr-1" />
            Add Contact
          </Button>
        )}
      </div>
      <div className="space-y-3">
        {agents.map(agent => (
          <div key={agent.id} className="flex items-center justify-between p-3 rounded-lg border">
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
          </div>
        ))}
        {agents.length === 0 && (
          <p className="text-muted-foreground text-center py-6">No contacts assigned to this event yet.</p>
        )}
      </div>
    </div>
  );
};
