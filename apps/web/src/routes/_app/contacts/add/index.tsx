import { createFileRoute } from '@tanstack/react-router';
import type { ContactWithCompanyDto } from '@tradelink/shared/contact';
import { Card, CardContent } from '@tradelink/ui/components/card';
import { ContactForm } from 'components/contact/ContactForm';
import { PageHeader } from 'components/page-header/PageHeader';
import { useState } from 'react';

export const Route = createFileRoute('/_app/contacts/add/')({
  component: AddContact,
});

export function AddContact() {
  const [editingContact, setEditingContact] = useState<ContactWithCompanyDto>();

  const handleSuccess = () => {
    setEditingContact(undefined);
  };

  const handleCancel = () => {
    setEditingContact(undefined);
  };

  return (
    <>
      <PageHeader title="Add Contact" />

      <Card>
        <CardContent className="pt-6">
          <ContactForm contact={editingContact || undefined} onSuccess={handleSuccess} onCancel={handleCancel} />
        </CardContent>
      </Card>
    </>
  );
}
