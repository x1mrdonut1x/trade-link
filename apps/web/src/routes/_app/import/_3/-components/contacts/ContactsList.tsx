import type { ContactImportData, ImportEntry } from '@tradelink/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@tradelink/ui/components/select';
import { Filter, Users } from '@tradelink/ui/icons';
import { useImportContext } from 'context';
import { useState } from 'react';
import { ContactEntryRow } from './ContactEntryRow';

type FilterOption = 'all' | 'new' | 'update';

export function ContactsList() {
  const importContext = useImportContext();

  const [contactFilter, setContactFilter] = useState<FilterOption>('all');

  const { previewData } = importContext;

  const handleEntryToggle = (type: 'companies' | 'contacts', index: number) => {
    if (!previewData) return;

    const updatedData = { ...previewData };
    if (type === 'companies') {
      updatedData.companies[index].selected = !updatedData.companies[index].selected;
    } else {
      updatedData.contacts[index].selected = !updatedData.contacts[index].selected;
    }
    importContext.setPreviewData(updatedData);
  };

  const handleCompanyChange = (contactIndex: number, companyId: number | null) => {
    if (!previewData) return;

    const updatedData = { ...previewData };

    if (companyId) {
      // For existing companies (positive IDs), we need to get the company name from the API
      // For now, we'll use a placeholder name since the CompanySelector only works with existing companies
      updatedData.contacts[contactIndex].matchedCompany = {
        id: companyId,
        name: 'Selected Company', // This will be updated by the CompanySelector
      };
      updatedData.contacts[contactIndex].companyId = companyId;
    } else {
      updatedData.contacts[contactIndex].matchedCompany = undefined;
      updatedData.contacts[contactIndex].companyId = undefined;
    }

    importContext.setPreviewData(updatedData);
  };

  const handleContactDataChange = (index: number, field: keyof ContactImportData, value: string) => {
    if (!previewData) return;

    const updatedData = { ...previewData };
    updatedData.contacts[index].data = {
      ...updatedData.contacts[index].data,
      [field]: value,
    };
    importContext.setPreviewData(updatedData);
  };

  if (!previewData) return null;

  const filterContacts = (contacts: ImportEntry<ContactImportData>[], filter: FilterOption) => {
    if (filter === 'all') return contacts;
    return contacts.filter(entry => entry.action === (filter === 'new' ? 'create' : 'update'));
  };

  const filteredContacts = filterContacts(previewData.contacts, contactFilter);

  return (
    <Card className="flex-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Contacts ({filteredContacts.length} of {previewData.contacts.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={contactFilter} onValueChange={(value: FilterOption) => setContactFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="new">New only</SelectItem>
                <SelectItem value="update">Updates only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredContacts.map(entry => {
            const originalIndex = previewData.contacts.indexOf(entry);
            return (
              <ContactEntryRow
                key={originalIndex}
                entry={entry}
                onToggle={() => handleEntryToggle('contacts', originalIndex)}
                onCompanyChange={companyId => handleCompanyChange(originalIndex, companyId)}
                onDataChange={(field, value) => handleContactDataChange(originalIndex, field, value)}
              />
            );
          })}
        </div>
        {filteredContacts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No contacts match the selected filter.</div>
        )}
      </CardContent>
    </Card>
  );
}
