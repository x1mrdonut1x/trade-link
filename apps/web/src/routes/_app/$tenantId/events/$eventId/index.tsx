import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@tradelink/ui/components/button';
import { ArrowLeft, Edit, UserPlus } from '@tradelink/ui/icons';
import { useGetEvent } from 'api/events/hooks';
import { PageHeader } from 'components/page-header/PageHeader';

import { Empty } from 'components/empty/Empty';
import { AddParticipantsDialog } from 'components/events/AddParticipantsDialog';
import { EventDialog } from 'components/events/EventDialog';
import { EventTagsCard } from 'components/events/EventTagsCard';
import { EventIcon } from 'components/icons/EventIcon';
import { useBreadcrumbSetup } from 'context/breadcrumb-context';
import { useState } from 'react';
import { EventInfoCard } from './-components/EventInfoCard';
import { EventQuickStatsCard } from './-components/EventQuickStatsCard';
import { EventSalesAgentsCard } from './-components/EventSalesAgentsCard';
import { ParticipatingCompaniesCard } from './-components/ParticipatingCompaniesCard';

export const Route = createFileRoute('/_app/$tenantId/events/$eventId/')({
  component: EventDetail,
});

function EventDetail() {
  const { tenantId, eventId } = Route.useParams();
  const { data: event, isLoading, error } = useGetEvent(eventId);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showAddParticipantsDialog, setShowAddParticipantsDialog] = useState(false);

  useBreadcrumbSetup([
    { title: 'Events', href: '/events', isActive: false },
    { title: event?.name || '', href: `/events/${eventId}`, isActive: true, isLoading: isLoading && !event },
  ]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <EventIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Loading event...</h3>
      </div>
    );
  }

  if (error || !event) {
    return (
      <Empty icon={EventIcon} title="Event not found" description="The event you're looking for doesn't exist.">
        <Button asChild>
          <Link to="/$tenantId/events" params={{ tenantId }}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </Button>
      </Empty>
    );
  }

  return (
    <>
      <PageHeader
        title={event.name}
        backTo="/events"
        actions={[
          {
            label: 'Add Participant',
            icon: UserPlus,
            variant: 'outline',
            onClick: () => setShowAddParticipantsDialog(true),
          },
          {
            label: 'Edit Event',
            icon: Edit,
            onClick: () => setShowEventDialog(true),
            variant: 'default',
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Event Overview */}
        <div className="lg:col-span-2 space-y-6">
          <EventInfoCard event={event} />
          <ParticipatingCompaniesCard
            companies={event.companies}
            onAddCompany={() => setShowAddParticipantsDialog(true)}
          />
          <EventSalesAgentsCard agents={event.contacts} onAddContact={() => setShowAddParticipantsDialog(true)} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <EventQuickStatsCard
            companiesCount={event.companies.length}
            agentsCount={event.contacts.length}
            status={event.status}
          />
          <EventTagsCard event={event} />
        </div>
      </div>
      <EventDialog open={showEventDialog} event={event} onOpenChange={setShowEventDialog} />
      <AddParticipantsDialog
        open={showAddParticipantsDialog}
        event={event}
        onOpenChange={setShowAddParticipantsDialog}
      />
    </>
  );
}
