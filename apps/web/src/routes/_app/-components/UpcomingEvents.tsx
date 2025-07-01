import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { Link } from '@tanstack/react-router';
import { Calendar } from 'lucide-react';

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
}

interface UpcomingEventsProps {
  events: Event[];
}

export const UpcomingEvents = ({ events }: UpcomingEventsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Sales Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map(event => (
            <div key={event.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">{event.name}</p>
                <p className="text-sm text-muted-foreground">
                  {event.date} • {event.location}
                </p>
              </div>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button asChild className="w-full" variant="outline">
            <Link to="/events">View All Events</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
