import { Badge } from '@tradelink/ui/components/badge';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { Calendar, CalendarPlus, MapPin } from '@tradelink/ui/icons';
import { Empty } from 'components/empty/Empty';
import { EventIcon } from 'components/icons/EventIcon';

interface UpcomingEventsCardProps {
  events: any[]; // TODO replace;
}

export function UpcomingEventsCard({ events }: UpcomingEventsCardProps) {
  const getStatusVariant = (status: any) => {
    switch (status) {
      case 'upcoming': {
        return 'default';
      }
      case 'completed': {
        return 'secondary';
      }
      case 'cancelled': {
        return 'destructive';
      }
      default: {
        return 'secondary';
      }
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <EventIcon className="h-5 w-5" />
          Upcoming Events ({events.length})
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
              <div className="flex-1">
                <p className="font-medium">{event.name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Calendar className="h-3 w-3" />
                  <span>{event.date}</span>
                  <MapPin className="h-3 w-3 ml-2" />
                  <span>{event.location}</span>
                </div>
              </div>
              <Badge variant={getStatusVariant(event.status)} className="text-xs capitalize">
                {event.status}
              </Badge>
            </div>
          ))}
          {events.length === 0 && (
            <Empty icon={EventIcon} title="No upcoming events" description="No upcoming events scheduled." />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
