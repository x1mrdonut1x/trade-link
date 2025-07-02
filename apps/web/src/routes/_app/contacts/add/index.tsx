import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Card, CardContent } from '@tradelink/ui/components/card';
import { ArrowLeft } from '@tradelink/ui/icons';
import { ContactForm } from 'components/contact/ContactForm';
import { PageHeader } from 'components/page-header/PageHeader';
import { useBreadcrumbSetup } from 'context/breadcrumb-context';

export const Route = createFileRoute('/_app/contacts/add/')({
  component: AddContact,
});

export function AddContact() {
  const router = useRouter();

  useBreadcrumbSetup([
    { title: 'Contacts', href: '/contacts', isActive: false },
    { title: 'Add Contact', href: '/contacts/add', isActive: true },
  ]);

  const handleSuccess = (contactId: number) => {
    router.navigate({ to: '/contacts/$contactId', params: { contactId: contactId.toString() } });
  };

  const handleCancel = () => {
    router.history.back();
  };

  return (
    <>
      <PageHeader
        title="Add Contact"
        actions={[
          {
            label: 'Back to Contacts',
            icon: ArrowLeft,
            variant: 'outline',
            link: { to: '/contacts' },
          },
        ]}
      />

      <Card>
        <CardContent className="pt-6">
          <ContactForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </>
  );
}
