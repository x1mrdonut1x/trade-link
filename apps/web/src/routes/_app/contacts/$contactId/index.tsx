import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@tradelink/ui/components/button';
import { useGetContact } from 'api/contact/hooks';
import { PageHeader } from 'components/page-header/PageHeader';
import { ArrowLeft, Edit, Loader2, User } from 'lucide-react';
import { ContactDetailsCard } from './-components/ContactDetailsCard';
import { ContactInfoCard } from './-components/ContactInfoCard';
import { QuickActionsCard } from './-components/QuickActionsCard';

export const Route = createFileRoute('/_app/contacts/$contactId/')({
  component: ContactDetail,
});

function ContactDetail() {
  const params = Route.useParams();
  const contactId = params.contactId;
  const { data: contact, isLoading, error } = useGetContact(contactId);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
        <h3 className="text-lg font-medium mb-2">Loading contact...</h3>
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Contact not found</h3>
        <p className="text-muted-foreground mb-4">
          {error ? 'There was an error loading the contact.' : "The contact you're looking for doesn't exist."}
        </p>
        <Button asChild>
          <Link to="/contacts">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Contacts
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={`${contact.firstName} ${contact.lastName}`}
        backTo="/contacts"
        actions={[
          {
            label: 'Edit Contact',
            icon: Edit,
            link: {
              to: '/contacts/$contactId/edit',
              params: { contactId },
            },
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contact Overview */}
        <div className="lg:col-span-2 space-y-6">
          <ContactInfoCard contact={contact} />
          <ContactDetailsCard contact={contact} />
          {/* TODO: Add back these components when we have the data structure for them */}
          {/* <AdditionalDetailsCard customFields={contact.customFields} />
          <RecentActivitiesCard activities={contact.recentActivities} />
          <UpcomingEventsCard events={contact.upcomingEvents} /> */}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <QuickActionsCard />
          {/* TODO: Add back when we have metrics data */}
          {/* <PerformanceMetricsCard metrics={contact.metrics} /> */}
        </div>
      </div>
    </>
  );
}
