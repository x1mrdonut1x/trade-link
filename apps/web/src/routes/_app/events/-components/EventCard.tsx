import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from '@tanstack/react-router';
import {
  Building2,
  Calendar,
  Download,
  Edit,
  MapPin,
  MoreHorizontal,
  Trash2,
  Users,
} from 'lucide-react';

interface Event {
  id: number;
  name: string;
  type: string;
  date: string;
  endDate: string;
  location: string;
  venue: string;
  status: string;
  description: string;
  companiesCount: number;
  agentsCount: number;
  tags: string[];
  customFields: Array<{ name: string; value: string }>;
  companies?: Array<{ id: number; name: string; agentsCount: number }>;
  agents?: Array<{ id: number; name: string; company: string }>;
}

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'Planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <Link to="/events/$eventId" params={{ eventId: event.id.toString() }}>
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
          <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
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
          {event.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDateRange(event.date, event.endDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{event.venue}</span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{event.companiesCount} Companies</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{event.agentsCount} Sales Agents</span>
            </div>
          </div>
        </div>

        {event.customFields.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-2">Event Details:</p>
            <div className="grid md:grid-cols-2 gap-2">
              {event.customFields.map((field, index) => (
                <div key={index} className="text-xs">
                  <span className="font-medium">{field.name}:</span> {field.value}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 border-t">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Associated Companies:</p>
              <div className="space-y-1">
                {event.companies?.slice(0, 3).map(company => (
                  <div key={company.id} className="text-xs flex justify-between">
                    <span>{company.name}</span>
                    <span className="text-muted-foreground">{company.agentsCount} agents</span>
                  </div>
                ))}
                {(event.companies?.length || 0) > 3 && (
                  <div className="text-xs text-muted-foreground">+{(event.companies?.length || 0) - 3} more companies</div>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Key Sales Agents:</p>
              <div className="space-y-1">
                {event.agents?.slice(0, 3).map(agent => (
                  <div key={agent.id} className="text-xs">
                    <span className="font-medium">{agent.name}</span>
                    <span className="text-muted-foreground"> • {agent.company}</span>
                  </div>
                ))}
                {(event.agents?.length || 0) > 3 && (
                  <div className="text-xs text-muted-foreground">+{(event.agents?.length || 0) - 3} more agents</div>
                )}
              </div>
            </div>
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
