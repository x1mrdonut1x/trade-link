import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header/PageHeader';
import { createFileRoute } from '@tanstack/react-router';
import { Filter, PlusCircle, User } from 'lucide-react';
import { useState } from 'react';
import { ContactCard } from './-components/ContactCard';

export const Route = createFileRoute('/_app/contacts/')({
  component: Contacts,
});

// Mock data - would come from API
const mockContacts = [
  {
    id: 1,
    firstName: 'Sarah',
    lastName: 'Mitchell',
    title: 'Senior Sales Agent',
    company: 'Grand Hotels Corporation',
    companyId: 1,
    email: 'sarah.mitchell@grandhotels.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    avatar: '/avatars/sarah-mitchell.jpg',
    lastContact: '2025-06-20',
    eventsCount: 3,
    tags: ['Luxury Hotels', 'VIP Clients', 'Top Performer'],
    customFields: [
      { name: 'Specialization', value: 'Corporate Events & Meetings' },
      { name: 'Years Experience', value: '8 years' },
      { name: 'Preferred Contact Method', value: 'Email' },
      { name: 'Commission Rate', value: '12%' },
    ],
  },
  {
    id: 2,
    firstName: 'Marcus',
    lastName: 'Rodriguez',
    title: 'Regional Sales Manager',
    company: 'Boutique Hospitality Group',
    companyId: 2,
    email: 'marcus.rodriguez@boutiquegroup.com',
    phone: '+1 (555) 456-7890',
    location: 'Los Angeles, CA',
    avatar: '/avatars/marcus-rodriguez.jpg',
    lastContact: '2025-06-18',
    eventsCount: 2,
    tags: ['Design Hotels', 'West Coast', 'Trade Shows'],
    customFields: [
      { name: 'Territory', value: 'Western United States' },
      { name: 'Client Focus', value: 'Boutique & Lifestyle Hotels' },
      { name: 'Meeting Preference', value: 'In-Person' },
      { name: 'Languages', value: 'English, Spanish' },
    ],
  },
  {
    id: 3,
    firstName: 'Jennifer',
    lastName: 'Park',
    title: 'Sales Agent',
    company: 'Resort & Spa International',
    companyId: 3,
    email: 'jennifer.park@resortandspa.com',
    phone: '+1 (555) 987-6543',
    location: 'Miami, FL',
    avatar: '/avatars/jennifer-park.jpg',
    lastContact: '2025-06-15',
    eventsCount: 1,
    tags: ['Resort Sales', 'Spa Services', 'International'],
    customFields: [
      { name: 'Specialty', value: 'All-Inclusive Resorts' },
      { name: 'Target Markets', value: 'Caribbean, Mexico' },
      { name: 'Contact Hours', value: '8 AM - 6 PM EST' },
      { name: 'Performance Rating', value: 'Excellent' },
    ],
  },
  {
    id: 4,
    firstName: 'David',
    lastName: 'Chen',
    title: 'Junior Sales Agent',
    company: 'Grand Hotels Corporation',
    companyId: 1,
    email: 'david.chen@grandhotels.com',
    phone: '+1 (555) 123-4568',
    location: 'Chicago, IL',
    avatar: '/avatars/david-chen.jpg',
    lastContact: '2025-06-22',
    eventsCount: 1,
    tags: ['New Hire', 'Training', 'Business Hotels'],
    customFields: [
      { name: 'Start Date', value: 'January 2025' },
      { name: 'Mentor', value: 'Sarah Mitchell' },
      { name: 'Training Progress', value: '75% Complete' },
      { name: 'Focus Area', value: 'Corporate Bookings' },
    ],
  },
];

function Contacts() {
  const [contacts] = useState(mockContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCompany = selectedCompany === 'all' || contact.company === selectedCompany;

    return matchesSearch && matchesCompany;
  });

  const companies = [...new Set(contacts.map(c => c.company))];

  return (
    <>
      <PageHeader
        title="Sales Agents"
        actions={[
          {
            label: "Filter",
            icon: Filter,
            variant: "outline"
          },
          {
            label: "Add Sales Agent",
            icon: PlusCircle,
            variant: "default"
          }
        ]}
        showSearch={true}
        searchPlaceholder="Search sales agents..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            value: selectedCompany,
            onChange: setSelectedCompany,
            placeholder: "All Companies",
            options: companies.map(company => ({
              value: company,
              label: company
            }))
          }
        ]}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredContacts.map(contact => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No sales agents found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first sales agent.'}
          </p>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Sales Agent
          </Button>
        </div>
      )}
    </>
  );
}
