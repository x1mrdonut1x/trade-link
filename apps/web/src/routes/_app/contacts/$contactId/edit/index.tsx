import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent } from '@tradelink/ui/components/card';
import { ArrowLeft, PersonStanding } from '@tradelink/ui/icons';
import { useGetContact } from 'api/contact/hooks';
import { ContactForm } from 'components/contact/ContactForm';
import { PageHeader } from 'components/page-header/PageHeader';
import { useBreadcrumbSetup } from 'context/breadcrumb-context';

export const Route = createFileRoute('/_app/contacts/$contactId/edit/')({
  component: EditContact,
});

export function EditContact() {
  const { contactId } = Route.useParams();
  const router = useRouter();

  const contactQuery = useGetContact(contactId);

  // Set up breadcrumbs
  const contactName = contactQuery.data ? `${contactQuery.data.firstName} ${contactQuery.data.lastName}` : '';
  useBreadcrumbSetup(
    [
      { title: 'Contacts', href: '/contacts', isActive: false },
      {
        title: contactName,
        href: `/contacts/${contactId}`,
        isActive: false,
        isLoading: contactQuery.isLoading && !contactQuery.data,
      },
      { title: 'Edit', href: `/contacts/${contactId}/edit`, isActive: true },
    ],
    contactQuery.isLoading && !contactQuery.data
  );

  const handleSuccess = () => {
    router.navigate({ to: '/contacts/$contactId', params: { contactId } });
  };

  const handleCancel = () => {
    router.history.back();
  };

  if (contactQuery.isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold mb-2">Loading contact...</h3>
        <p className="text-muted-foreground">Please wait while we fetch the contact details.</p>
      </div>
    );
  }

  if (!contactQuery.data) {
    return (
      <div className="text-center py-12">
        <PersonStanding className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Contact not found</h3>
        <p className="text-muted-foreground mb-4">The contact you're looking for doesn't exist.</p>
        <Button>
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
      <PageHeader title="Edit Contact" />

      <div className="max-w-2xl sm:mx-auto">
        <Card>
          <CardContent className="pt-6">
            <ContactForm contact={contactQuery.data} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
