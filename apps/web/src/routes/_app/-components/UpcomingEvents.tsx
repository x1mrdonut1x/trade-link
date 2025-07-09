import { Link } from '@tanstack/react-router';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { Calendar } from '@tradelink/ui/icons';
import { useGetAllEvents } from 'api/events';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useTenantParam } from 'hooks/use-tenant-param';
dayjs.extend(utc);

export const UpcomingEvents = () => {
  const tenantId = useTenantParam();

  const eventsQuery = useGetAllEvents();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Sales Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {eventsQuery.data?.map(event => (
            <div key={event.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">{event.name}</p>
                <p className="text-sm text-muted-foreground">
                  {dayjs.utc(event.startDate).format('YYYY-MM-DD')} • {event.location}
                </p>
              </div>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button asChild className="w-full" variant="outline">
            <Link to="/$tenantId/events" params={{ tenantId }}>
              View All Events
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
