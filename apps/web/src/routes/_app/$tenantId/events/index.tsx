import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@tradelink/ui/components/button';
import { Calendar, Filter, PlusCircle, Upload } from '@tradelink/ui/icons';
import { useGetAllEvents } from 'api/events';
import { EventDialog } from 'components/events/EventDialog';
import { PageHeader } from 'components/page-header/PageHeader';
import { useState } from 'react';

import { EventCard } from './-components/EventCard';

export const Route = createFileRoute('/_app/$tenantId/events/')({
  component: EventsPage,
});

function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showEventDialog, setShowEventDialog] = useState(false);

  const {
    data: events = [],
    isLoading,
    error,
  } = useGetAllEvents({
    search: searchTerm || undefined,
    status: selectedStatus === 'all' ? undefined : selectedStatus,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading events: {error.message}</div>
      </div>
    );
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const statuses = [...new Set(events.map(e => e.status))];

  return (
    <>
      <PageHeader
        title="Hotel Sales Events"
        actions={[
          {
            label: 'Import Event Data',
            icon: Upload,
            variant: 'outline',
          },
          {
            label: 'Filter',
            icon: Filter,
            variant: 'outline',
          },
          {
            label: 'Add Event',
            icon: PlusCircle,
            variant: 'default',
            onClick: () => setShowEventDialog(true),
          },
        ]}
        showSearch={true}
        searchPlaceholder="Search events..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            value: selectedStatus,
            onChange: setSelectedStatus,
            placeholder: 'All Statuses',
            options: statuses.map(status => ({
              value: status,
              label: status,
            })),
          },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {filteredEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No events found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first event.'}
          </p>
          <Button onClick={() => setShowEventDialog(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      )}

      <EventDialog open={showEventDialog} onOpenChange={setShowEventDialog} />
    </>
  );
}
