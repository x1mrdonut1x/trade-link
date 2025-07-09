import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@tradelink/ui/components/button';
import { ArrowLeft, Edit, Loader2 } from '@tradelink/ui/icons';
import { useGetContact } from 'api/contact/hooks';
import { PageHeader } from 'components/page-header/PageHeader';
import { EntityTagsCard } from 'components/tags';
import { useBreadcrumbSetup } from 'context/breadcrumb-context';

import { ContactIcon } from 'components/icons/ContactIcon';
import { NotesCard } from 'components/notes';
import { TasksCard } from 'components/tasks';
import { ContactDetailsCard } from './-components/ContactDetailsCard';
import { ContactInfoCard } from './-components/ContactInfoCard';
import { QuickActionsCard } from './-components/QuickActionsCard';

export const Route = createFileRoute('/_app/$tenantId/contacts/$contactId/')({
  component: ContactDetail,
});

function ContactDetail() {
  const { tenantId, contactId } = Route.useParams();
  const { data: contact, isLoading, error } = useGetContact(contactId);

  // Set up breadcrumbs
  const contactName = contact ? `${contact.firstName} ${contact.lastName}` : ``;
  useBreadcrumbSetup(
    [
      { title: 'Contacts', href: '/contacts', isActive: false },
      {
        title: contactName,
        href: `/contacts/${contactId}`,
        isActive: true,
        isLoading: isLoading && !contact,
      },
    ],
    isLoading && !contact
  );

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
        <ContactIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Contact not found</h3>
        <p className="text-muted-foreground mb-4">
          {error ? 'There was an error loading the contact.' : "The contact you're looking for doesn't exist."}
        </p>
        <Button asChild>
          <Link to="/$tenantId/contacts" params={{ tenantId }}>
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
              to: '/$tenantId/contacts/$contactId/edit',
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
          <NotesCard contactId={Number(contactId)} title="Contact Notes" />
          <TasksCard contactId={Number(contactId)} title="Contact Tasks" />
          {/* Future: Add back these components when we have the data structure for them */}
          {/* <AdditionalDetailsCard customFields={contact.customFields} />
          <RecentActivitiesCard activities={contact.recentActivities} />
          <UpcomingEventsCard events={contact.upcomingEvents} /> */}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <EntityTagsCard entityType="contact" entityId={Number(contactId)} tags={contact.tags || []} />
          <QuickActionsCard />
          {/* Future: Add back when we have metrics data */}
          {/* <PerformanceMetricsCard metrics={contact.metrics} /> */}
        </div>
      </div>
    </>
  );
}
