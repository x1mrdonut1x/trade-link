import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@tradelink/ui/components/button';
import { Calendar, Filter, PlusCircle, Upload } from '@tradelink/ui/icons';
import { PageHeader } from 'components/page-header/PageHeader';
import { useState } from 'react';

import { EventCard } from './-components/EventCard';

export const Route = createFileRoute('/_app/$tenantId/events/')({
  component: EventsPage,
});

// Mock data - would come from API
const mockEvents = [
  {
    id: 1,
    name: 'International Hotel Investment Summit 2025',
    type: 'Investment Conference',
    date: '2025-07-15',
    endDate: '2025-07-17',
    location: 'Berlin, Germany',
    venue: 'InterContinental Berlin',
    status: 'Upcoming',
    description: 'Premier global conference for hotel investment, development, and finance professionals.',
    companiesCount: 45,
    agentsCount: 28,
    tags: ['Investment', 'Finance', 'International', 'Luxury'],
    customFields: [
      { name: 'Booth Number', value: 'Hall A, Booth 15' },
      { name: 'Budget Allocated', value: '€35,000' },
      { name: 'Team Lead', value: 'Sarah Mitchell' },
      { name: 'Expected Leads', value: '80-120' },
      { name: 'Registration Fee', value: '€2,500 per person' },
    ],
    companies: [
      { id: 1, name: 'Grand Hotels Corporation', agentsCount: 8 },
      { id: 2, name: 'Boutique Hospitality Group', agentsCount: 6 },
    ],
    agents: [
      { id: 1, name: 'Sarah Mitchell', company: 'Grand Hotels Corporation' },
      { id: 2, name: 'Marcus Rodriguez', company: 'Boutique Hospitality Group' },
    ],
  },
  {
    id: 2,
    name: 'Resort & Spa Trade Show',
    type: 'Trade Show',
    date: '2025-08-22',
    endDate: '2025-08-24',
    location: 'Las Vegas, NV',
    venue: 'Las Vegas Convention Center',
    status: 'Planning',
    description: 'Leading trade show for resort and spa industry professionals, featuring the latest trends and services.',
    companiesCount: 32,
    agentsCount: 18,
    tags: ['Resort', 'Spa', 'Wellness', 'Networking'],
    customFields: [
      { name: 'Focus Area', value: 'Luxury Resorts & Spa Services' },
      { name: 'Target Attendees', value: '500+' },
      { name: 'Registration Deadline', value: '2025-07-01' },
      { name: 'Sponsorship Level', value: 'Gold Sponsor' },
    ],
    companies: [{ id: 3, name: 'Resort & Spa International', agentsCount: 12 }],
    agents: [{ id: 3, name: 'Jennifer Park', company: 'Resort & Spa International' }],
  },
  {
    id: 3,
    name: 'Boutique Hotel Summit 2025',
    type: 'Conference',
    date: '2025-09-10',
    endDate: '2025-09-11',
    location: 'San Francisco, CA',
    venue: 'The St. Regis San Francisco',
    status: 'Completed',
    description: 'Exclusive summit for boutique hotel owners, operators, and industry innovators.',
    companiesCount: 28,
    agentsCount: 22,
    tags: ['Boutique', 'Design', 'Innovation', 'Luxury'],
    customFields: [
      { name: 'Speaking Slot', value: 'Yes - Panel Discussion' },
      { name: 'Sponsor Level', value: 'Platinum Sponsor' },
      { name: 'Leads Generated', value: '67' },
      { name: 'Follow-up Meetings', value: '24 scheduled' },
    ],
    companies: [
      { id: 1, name: 'Grand Hotels Corporation', agentsCount: 5 },
      { id: 2, name: 'Boutique Hospitality Group', agentsCount: 8 },
    ],
    agents: [
      { id: 1, name: 'Sarah Mitchell', company: 'Grand Hotels Corporation' },
      { id: 2, name: 'Marcus Rodriguez', company: 'Boutique Hospitality Group' },
    ],
  },
];

function EventsPage() {
  const [events] = useState(mockEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

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
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      )}
    </>
  );
}
