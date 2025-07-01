import { createFileRoute } from '@tanstack/react-router';
import { ContactList } from 'components/contact/ContactList';

export const Route = createFileRoute('/_app/contacts/')({
  component: Contacts,
});

function Contacts() {
  return <ContactList />;
}
