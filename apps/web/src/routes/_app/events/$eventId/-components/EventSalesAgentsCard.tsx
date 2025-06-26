interface Agent {
  id: number;
  name: string;
  company: string;
}

interface EventSalesAgentsCardProps {
  agents: Agent[];
}

export const EventSalesAgentsCard = ({ agents }: EventSalesAgentsCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Sales Agents ({agents.length})</h3>
      <div className="space-y-3">
        {agents.map(agent => (
          <div key={agent.id} className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="font-medium">{agent.name}</p>
              <p className="text-sm text-muted-foreground">{agent.company}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
