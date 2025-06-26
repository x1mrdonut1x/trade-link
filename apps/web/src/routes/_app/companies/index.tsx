import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header/PageHeader';
import { createFileRoute } from '@tanstack/react-router';
import { Building2, Filter, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { CompanyCard } from './-components/CompanyCard';

export const Route = createFileRoute('/_app/companies/')({
  component: Companies,
});

// Mock data - would come from API
const mockCompanies = [
  {
    id: 1,
    name: 'Grand Hotels Corporation',
    industry: 'Luxury Hotels',
    size: 'Large (1000+ employees)',
    location: 'New York, NY',
    phone: '+1 (555) 123-4567',
    email: 'contact@grandhotels.com',
    website: 'www.grandhotels.com',
    agentsCount: 5,
    eventsCount: 3,
    lastContact: '2025-06-20',
    tags: ['Luxury', 'Chain Hotels', 'Premium Client'],
    customFields: [
      { name: 'Annual Revenue', value: '$500M+' },
      { name: 'Primary Contact', value: 'John Smith (VP Sales)' },
      { name: 'Hotel Count', value: '250+ properties' },
    ],
  },
  {
    id: 2,
    name: 'Boutique Hospitality Group',
    industry: 'Boutique Hotels',
    size: 'Medium (100-1000 employees)',
    location: 'San Francisco, CA',
    phone: '+1 (555) 987-6543',
    email: 'contact@boutiquegroup.com',
    website: 'www.boutiquegroup.com',
    agentsCount: 8,
    eventsCount: 2,
    lastContact: '2025-06-18',
    tags: ['Boutique', 'Design Hotels', 'Growing Client'],
    customFields: [
      { name: 'Specialization', value: 'Design & Lifestyle Hotels' },
      { name: 'Target Market', value: 'Millennials & Gen Z' },
      { name: 'Properties', value: '45 hotels' },
    ],
  },
  {
    id: 3,
    name: 'Resort & Spa International',
    industry: 'Resort Hotels',
    size: 'Large (1000+ employees)',
    location: 'Miami, FL',
    phone: '+1 (555) 456-7890',
    email: 'sales@resortandspa.com',
    website: 'www.resortandspa.com',
    agentsCount: 3,
    eventsCount: 1,
    lastContact: '2025-06-15',
    tags: ['Resort', 'Spa', 'Vacation'],
    customFields: [
      { name: 'Resort Type', value: 'All-Inclusive & Luxury Spa' },
      { name: 'Locations', value: 'Caribbean, Mexico, Hawaii' },
      { name: 'Average Room Rate', value: '$400+/night' },
    ],
  },
];

function Companies() {
  const [companies] = useState(mockCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  const filteredCompanies = companies.filter(company => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry;

    return matchesSearch && matchesIndustry;
  });

  const industries = [...new Set(companies.map(c => c.industry))];

  return (
    <>
      <PageHeader
        title="Companies"
        actions={[
          {
            label: "Filter",
            icon: Filter,
            variant: "outline"
          },
          {
            label: "Add Company",
            icon: PlusCircle,
            variant: "default"
          }
        ]}
        showSearch={true}
        searchPlaceholder="Search companies..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            value: selectedIndustry,
            onChange: setSelectedIndustry,
            placeholder: "All Industries",
            options: industries.map(industry => ({
              value: industry,
              label: industry
            }))
          }
        ]}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCompanies.map(company => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No companies found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by adding your first company.'}
          </p>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Company
          </Button>
        </div>
      )}
    </>
  );
}
