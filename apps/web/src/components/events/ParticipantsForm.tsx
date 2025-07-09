import type { GetEventResponse } from '@tradelink/shared/events';
import { Badge } from '@tradelink/ui/components/badge';
import { Button } from '@tradelink/ui/components/button';
import { UserPlus, X } from '@tradelink/ui/icons';
import { CompanySelector } from 'components/company-selector/CompanySelector';
import { ContactSelector } from 'components/contact-selector/ContactSelector';
import { CompanyIcon } from 'components/icons/CompanyIcon';
import { useState } from 'react';

interface ParticipantsFormProps {
  selectedCompanyIds: number[];
  selectedContactIds: number[];
  onCompanyIdsChange: (companyIds: number[]) => void;
  onContactIdsChange: (contactIds: number[]) => void;
  event?: GetEventResponse;
}

export function ParticipantsForm({
  selectedCompanyIds,
  selectedContactIds,
  onCompanyIdsChange,
  onContactIdsChange,
  event,
}: ParticipantsFormProps) {
  const [newCompanyId, setNewCompanyId] = useState<string>('');
  const [newContactId, setNewContactId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'companies' | 'contacts'>('companies');

  const handleAddCompany = () => {
    if (newCompanyId && !selectedCompanyIds.includes(Number(newCompanyId))) {
      onCompanyIdsChange([...selectedCompanyIds, Number(newCompanyId)]);
      setNewCompanyId('');
    }
  };

  const handleRemoveCompany = (companyId: number) => {
    onCompanyIdsChange(selectedCompanyIds.filter(id => id !== companyId));
  };

  const handleAddContact = () => {
    if (newContactId && !selectedContactIds.includes(Number(newContactId))) {
      onContactIdsChange([...selectedContactIds, Number(newContactId)]);
      setNewContactId('');
    }
  };

  const handleRemoveContact = (contactId: number) => {
    onContactIdsChange(selectedContactIds.filter(id => id !== contactId));
  };

  const getCompanyName = (companyId: number) => {
    const company = event?.companies?.find(c => c.id === companyId);
    return company?.name || `Company ${companyId}`;
  };

  const getContactName = (contactId: number) => {
    const contact = event?.contacts?.find(c => c.id === contactId);
    return contact ? `${contact.firstName} ${contact.lastName}` : `Contact ${contactId}`;
  };

  const renderCompaniesSection = () => (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <CompanySelector
            value={newCompanyId}
            onValueChange={setNewCompanyId}
            placeholder="Select a company to add..."
            searchPlaceholder="Search companies..."
            emptyText="No companies found"
          />
        </div>
        <Button
          type="button"
          onClick={handleAddCompany}
          disabled={!newCompanyId || selectedCompanyIds.includes(Number(newCompanyId))}
        >
          Add
        </Button>
      </div>

      {selectedCompanyIds.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Companies:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCompanyIds.map(companyId => (
              <Badge key={companyId} variant="secondary" className="flex items-center gap-1">
                {getCompanyName(companyId)}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemoveCompany(companyId)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderContactsSection = () => (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <ContactSelector
            value={newContactId}
            onValueChange={setNewContactId}
            placeholder="Select a contact to add..."
            searchPlaceholder="Search contacts..."
            emptyText="No contacts found"
          />
        </div>
        <Button
          type="button"
          onClick={handleAddContact}
          disabled={!newContactId || selectedContactIds.includes(Number(newContactId))}
        >
          Add
        </Button>
      </div>

      {selectedContactIds.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Contacts:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedContactIds.map(contactId => (
              <Badge key={contactId} variant="secondary" className="flex items-center gap-1">
                {getContactName(contactId)}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleRemoveContact(contactId)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Tab-like buttons */}
      <div className="flex space-x-1 bg-muted rounded-lg p-1">
        <Button
          type="button"
          variant={activeTab === 'companies' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('companies')}
          className="flex-1"
        >
          <CompanyIcon className="h-4 w-4 mr-2" />
          Companies ({selectedCompanyIds.length})
        </Button>
        <Button
          type="button"
          variant={activeTab === 'contacts' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('contacts')}
          className="flex-1"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Contacts ({selectedContactIds.length})
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'companies' && renderCompaniesSection()}
      {activeTab === 'contacts' && renderContactsSection()}
    </div>
  );
}
