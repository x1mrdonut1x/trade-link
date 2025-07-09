import { Link } from '@tanstack/react-router';
import type { EventDto } from '@tradelink/shared';
import { Badge } from '@tradelink/ui/components/badge';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@tradelink/ui/components/dropdown-menu';
import { Calendar, Download, Edit, MapPin, MoreHorizontal, Trash2 } from '@tradelink/ui/icons';
import { CompanyIcon } from 'components/icons/CompanyIcon';
import { useTenantParam } from 'hooks/use-tenant-param';

interface EventCardProps {
  event: EventDto;
}

export function EventCard({ event }: EventCardProps) {
  const tenantId = useTenantParam();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming': {
        return 'bg-blue-100 text-blue-800';
      }
      case 'Planning': {
        return 'bg-yellow-100 text-yellow-800';
      }
      case 'Completed': {
        return 'bg-green-100 text-green-800';
      }
      default: {
        return 'bg-gray-100 text-gray-800';
      }
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (startDate === endDate) {
      return start.toLocaleDateString();
    }

    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  return (
    <Link to="/$tenantId/events/$eventId" params={{ tenantId, eventId: event.id.toString() }}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-xl">{event.name}</CardTitle>
              <Badge className={`${getStatusColor(event.status)} border-0`}>{event.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{event.type}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={e => e.preventDefault()}>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Export Agents
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{event.description}</p>

          <div className="flex flex-wrap gap-1">
            {event.tags?.map(tag => (
              <Badge key={tag.id} style={{ backgroundColor: tag.color }}>
                {tag.name}
              </Badge>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDateRange(event.startDate, event.endDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
              {event.venue && (
                <div className="flex items-center gap-2">
                  <CompanyIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{event.venue}</span>
                </div>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Type:</span>
                <span>{event.type}</span>
              </div>
              {event.rating && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Rating:</span>
                  <span>{event.rating}/5</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-1" />
              Export List
            </Button>
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4 mr-1" />
              Prepare for Event
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
