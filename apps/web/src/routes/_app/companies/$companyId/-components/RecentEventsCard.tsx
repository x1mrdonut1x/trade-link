import { Badge } from '@tradelink/ui/components/badge';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { Calendar, CalendarPlus } from 'lucide-react';

interface RecentEventsCardProps {
  events: any[];
}

export function RecentEventsCard({ events }: RecentEventsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Recent Events ({events.length})
        </CardTitle>
        <Button size="sm" variant="outline">
          <CalendarPlus className="h-4 w-4 mr-1" />
          Add Event
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map(event => (
            <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="font-medium">{event.name}</p>
                <p className="text-sm text-muted-foreground">{event.date}</p>
              </div>
              <Badge variant={event.status === 'Completed' ? 'default' : 'secondary'}>{event.status}</Badge>
            </div>
          ))}
          {events.length === 0 && <p className="text-muted-foreground text-center py-6">No recent events for this company.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
