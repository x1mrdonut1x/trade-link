import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useContacts, useDeleteContact } from '../../api/contact/hooks';
import { ContactForm } from './ContactForm';
import type { ContactWithCompanyDto } from 'shared/contact';

export function ContactList() {
  const { data: contacts, isLoading, error } = useContacts();
  const deleteContact = useDeleteContact();
  const [editingContact, setEditingContact] = useState<ContactWithCompanyDto | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleEdit = (contact: ContactWithCompanyDto) => {
    setEditingContact(contact);
    setShowCreateForm(false);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete contact:', error);
      }
    }
  };

  const handleSuccess = () => {
    setEditingContact(null);
    setShowCreateForm(false);
  };

  const handleCancel = () => {
    setEditingContact(null);
    setShowCreateForm(false);
  };

  if (isLoading) return <div>Loading contacts...</div>;
  if (error) return <div>Error loading contacts: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          Add New Contact
        </Button>
      </div>

      {(showCreateForm || editingContact) && (
        <ContactForm
          contact={editingContact || undefined}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}

      <div className="grid gap-4">
        {contacts?.map((contact) => (
          <Card key={contact.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>
                  {contact.firstName} {contact.lastName}
                </span>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(contact)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(contact.id)}
                    disabled={deleteContact.isPending}
                  >
                    Delete
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {contact.email && (
                  <div>
                    <span className="font-medium">Email:</span> {contact.email}
                  </div>
                )}
                {contact.phone_number && (
                  <div>
                    <span className="font-medium">Phone:</span>{' '}
                    {contact.phone_prefix} {contact.phone_number}
                  </div>
                )}
                {contact.company?.name && (
                  <div>
                    <span className="font-medium">Company:</span> {contact.company.name}
                  </div>
                )}
                {contact.job_title && (
                  <div>
                    <span className="font-medium">Job Title:</span> {contact.job_title}
                  </div>
                )}
                {contact.city && contact.country && (
                  <div>
                    <span className="font-medium">Location:</span>{' '}
                    {contact.city}, {contact.country}
                  </div>
                )}
                {contact.address && (
                  <div className="md:col-span-2">
                    <span className="font-medium">Address:</span>{' '}
                    {contact.address}
                    {contact.post_code && `, ${contact.post_code}`}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )) || <div>No contacts found.</div>}
      </div>
    </div>
  );
}
