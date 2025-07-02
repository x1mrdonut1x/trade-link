import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { UserPlus, Users } from 'lucide-react';

interface SalesAgentsCardProps {
  agents: any[];
}

export function SalesAgentsCard({ agents }: SalesAgentsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Sales Agents ({agents.length})
        </CardTitle>
        <Button size="sm" variant="outline">
          <UserPlus className="h-4 w-4 mr-1" />
          Add Agent
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {agents.map(agent => (
            <div key={agent.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">{agent.name}</p>
                <p className="text-sm text-muted-foreground">{agent.title}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Last contact</p>
                <p className="text-sm">{agent.lastContact}</p>
              </div>
            </div>
          ))}
          {agents.length === 0 && <p className="text-muted-foreground text-center py-6">No sales agents assigned to this company.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
