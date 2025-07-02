import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Card, CardContent } from '@tradelink/ui/components/card';
import { useGetContact } from 'api/contact/hooks';
import { ContactForm } from 'components/contact/ContactForm';
import { PageHeader } from 'components/page-header/PageHeader';

export const Route = createFileRoute('/_app/contacts/$contactId/edit/')({
  component: EditContact,
});

export function EditContact() {
  const { contactId } = Route.useParams();
  const router = useRouter();

  const contactQuery = useGetContact(contactId);

  const handleSuccess = () => {
    router.navigate({ to: '/contacts/$contactId', params: { contactId } });
  };

  const handleCancel = () => {
    router.history.back();
  };

  return (
    <>
      <PageHeader title="Edit Contact" />

      <Card>
        <CardContent className="pt-6">
          <ContactForm contact={contactQuery.data} onSuccess={handleSuccess} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </>
  );
}
