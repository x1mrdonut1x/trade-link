import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header/PageHeader';
import { createFileRoute, Link } from '@tanstack/react-router';
import { 
  ArrowLeft, 
  User, 
  Edit, 
  MessageSquare,
  Phone,
  Calendar
} from 'lucide-react';
import { ContactInfoCard } from './-components/ContactInfoCard';
import { AdditionalDetailsCard } from './-components/AdditionalDetailsCard';
import { RecentActivitiesCard } from './-components/RecentActivitiesCard';
import { UpcomingEventsCard } from './-components/UpcomingEventsCard';
import { PerformanceMetricsCard } from './-components/PerformanceMetricsCard';
import { QuickActionsCard } from './-components/QuickActionsCard';
import { mockContacts } from './-components/mockData';

export const Route = createFileRoute('/_app/contacts/$contactId/')({
  component: ContactDetail,
});

function ContactDetail() {
  const params = Route.useParams();
  const contactId = params.contactId;
  const contact = mockContacts.find(c => c.id === parseInt(contactId));

  if (!contact) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Contact not found</h3>
        <p className="text-muted-foreground mb-4">The contact you're looking for doesn't exist.</p>
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
        showBackButton={true}
        backTo="/contacts"
        actions={[
          {
            label: "Send Message",
            icon: MessageSquare,
            variant: "outline"
          },
          {
            label: "Schedule Call",
            icon: Phone,
            variant: "outline"
          },
          {
            label: "Schedule Meeting",
            icon: Calendar,
            variant: "outline"
          },
          {
            label: "Edit Contact",
            icon: Edit,
            variant: "default"
          }
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contact Overview */}
        <div className="lg:col-span-2 space-y-6">
          <ContactInfoCard contact={contact} />
          <AdditionalDetailsCard customFields={contact.customFields} />
          <RecentActivitiesCard activities={contact.recentActivities} />
          <UpcomingEventsCard events={contact.upcomingEvents} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <PerformanceMetricsCard metrics={contact.metrics} />
          <QuickActionsCard />
        </div>
      </div>
    </>
  );
}
