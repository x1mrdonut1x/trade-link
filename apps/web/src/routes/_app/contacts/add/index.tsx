import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Card, CardContent } from '@tradelink/ui/components/card';
import { ArrowLeft } from '@tradelink/ui/icons';
import { ContactForm } from 'components/contact/ContactForm';
import { PageHeader } from 'components/page-header/PageHeader';
import { useBreadcrumbSetup } from 'context/breadcrumb-context';
import { z } from 'zod';

const addContactSearchSchema = z.object({
  companyId: z.number().optional(),
});

export const Route = createFileRoute('/_app/contacts/add/')({
  component: AddContact,
  validateSearch: addContactSearchSchema,
});

export function AddContact() {
  const router = useRouter();
  const { companyId } = Route.useSearch();

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

      <div className="max-w-2xl sm:mx-auto">
        <Card>
          <CardContent className="pt-6">
            <ContactForm defaultCompanyId={companyId} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
