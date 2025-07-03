import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';

interface QuickStatsCardProps {
  agentsCount: number;
  eventsCount: number;
  lastContact: string;
}

export function QuickStatsCard({ agentsCount, eventsCount, lastContact }: QuickStatsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Sales Agents</span>
          <span className="font-semibold">{agentsCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Events</span>
          <span className="font-semibold">{eventsCount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Last Contact</span>
          <span className="font-semibold">{lastContact}</span>
        </div>
      </CardContent>
    </Card>
  );
}
