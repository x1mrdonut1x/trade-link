import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header/PageHeader';
import { createFileRoute, Link } from '@tanstack/react-router';
import { 
  ArrowLeft, 
  Calendar, 
  Edit, 
  UserPlus
} from 'lucide-react';
import { mockEvents } from './-components/mockData';
import { EventInfoCard } from './-components/EventInfoCard';
import { ParticipatingCompaniesCard } from './-components/ParticipatingCompaniesCard';
import { EventSalesAgentsCard } from './-components/EventSalesAgentsCard';
import { EventQuickStatsCard } from './-components/EventQuickStatsCard';
import { EventAdditionalDetailsCard } from './-components/EventAdditionalDetailsCard';

export const Route = createFileRoute('/_app/events/$eventId/')({
  component: EventDetail,
});

function EventDetail() {
  const params = Route.useParams();
  const eventId = params.eventId;
  const event = mockEvents.find(e => e.id === parseInt(eventId));

  if (!event) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Event not found</h3>
        <p className="text-muted-foreground mb-4">The event you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/events">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={event.name}
        showBackButton={true}
        backTo="/events"
        actions={[
          {
            label: "Add Participant",
            icon: UserPlus,
            variant: "outline"
          },
          {
            label: "Edit Event",
            icon: Edit,
            variant: "default"
          }
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Event Overview */}
        <div className="lg:col-span-2 space-y-6">
          <EventInfoCard event={event} />
          <ParticipatingCompaniesCard companies={event.companies} />
          <EventSalesAgentsCard agents={event.agents} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <EventQuickStatsCard
            companiesCount={event.companiesCount}
            agentsCount={event.agentsCount}
            status={event.status}
          />
          <EventAdditionalDetailsCard customFields={event.customFields} />
        </div>
      </div>
    </>
  );
}
