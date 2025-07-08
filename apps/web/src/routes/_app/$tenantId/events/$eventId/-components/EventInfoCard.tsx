import { Building2, Calendar, MapPin } from '@tradelink/ui/icons';

interface Event {
  name: string;
  description: string;
  date: string;
  endDate: string;
  location: string;
  venue: string;
  type: string;
  status: string;
  companiesCount: number;
}

interface EventInfoCardProps {
  event: Event;
}

export const EventInfoCard = ({ event }: EventInfoCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Event Information</h3>
      <p className="text-muted-foreground mb-4">{event.description}</p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Date:</span>
            <span>
              {event.date} - {event.endDate}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Location:</span>
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Venue:</span>
            <span>{event.venue}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Type:</span>
            <span>{event.type}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Status:</span>
            <span className="capitalize">{event.status}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Companies:</span>
            <span>{event.companiesCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
