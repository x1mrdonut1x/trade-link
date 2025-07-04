import type { ContactImportData, ImportEntry } from '@tradelink/shared';
import { Badge } from '@tradelink/ui/components/badge';
import { Button } from '@tradelink/ui/components/button';
import { Checkbox } from '@tradelink/ui/components/checkbox';
import { FormInput } from '@tradelink/ui/components/form-input';
import { CompanySelector } from 'components/company-selector/CompanySelector';

import { useState } from 'react';

interface EditContactFormProps {
  entry: ImportEntry<ContactImportData>;
  onToggle: () => void;
  onCompanyChange: (companyId: number | null) => void;
  onDataChange: (field: keyof ContactImportData, value: string) => void;
  onCancel: () => void;
}

export function EditContactForm({ entry, onToggle, onCompanyChange, onDataChange, onCancel }: EditContactFormProps) {
  const [tempData, setTempData] = useState(entry.data);

  const handleSaveEdit = () => {
    for (const key of Object.keys(tempData)) {
      const field = key as keyof ContactImportData;
      if (tempData[field] !== entry.data[field]) {
        onDataChange(field, tempData[field] || '');
      }
    }
  };

  return (
    <div className="border rounded-lg shadow-sm bg-muted/30">
      <div className="flex items-center gap-3 p-3 border-b bg-background">
        <Checkbox checked={entry.selected} onCheckedChange={onToggle} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">Editing Contact</span>
            <Badge variant={entry.action === 'create' ? 'default' : 'secondary'}>
              {entry.action === 'create' ? 'New' : 'Update'}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSaveEdit}>
            Save
          </Button>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="First Name"
            id="firstName"
            value={tempData.firstName}
            onChange={e => setTempData(prev => ({ ...prev, firstName: e.target.value }))}
            placeholder="First Name"
          />
          <FormInput
            label="Last Name"
            id="lastName"
            value={tempData.lastName}
            onChange={e => setTempData(prev => ({ ...prev, lastName: e.target.value }))}
            placeholder="Last Name"
          />
        </div>
        <FormInput
          label="Email"
          id="email"
          value={tempData.email}
          onChange={e => setTempData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="Email"
          type="email"
        />
        <FormInput
          label="Job Title"
          id="jobTitle"
          value={tempData.jobTitle || ''}
          onChange={e => setTempData(prev => ({ ...prev, jobTitle: e.target.value }))}
          placeholder="Job Title (optional)"
        />
        <FormInput
          label="Phone"
          id="phoneNumber"
          value={tempData.phoneNumber || ''}
          onChange={e => setTempData(prev => ({ ...prev, phoneNumber: e.target.value }))}
          placeholder="Phone (optional)"
        />
        <div className="space-y-2">
          <label htmlFor="company" className="text-sm font-medium">
            Company
          </label>
          <div id="company">
            <CompanySelector
              value={
                entry.matchedCompany?.id && entry.matchedCompany.id > 0 ? entry.matchedCompany.id.toString() : undefined
              }
              onValueChange={companyId => {
                onCompanyChange(companyId ? Number.parseInt(companyId) : null);
              }}
              placeholder="Select company"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
