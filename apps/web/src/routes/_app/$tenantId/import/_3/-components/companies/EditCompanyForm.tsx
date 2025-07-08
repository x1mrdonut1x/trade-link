import type { CompanyImportData, ImportEntry } from '@tradelink/shared';
import { Badge } from '@tradelink/ui/components/badge';
import { Button } from '@tradelink/ui/components/button';
import { Checkbox } from '@tradelink/ui/components/checkbox';
import { FormInput } from '@tradelink/ui/components/form-input';
import { useState } from 'react';

interface EditCompanyFormProps {
  entry: ImportEntry<CompanyImportData>;
  index: number;
  onToggle: () => void;
  onDataChange: <K extends keyof CompanyImportData>(field: K, value: CompanyImportData[K]) => void;
  onCancel: () => void;
}

export function EditCompanyForm({ entry, index, onToggle, onDataChange, onCancel }: EditCompanyFormProps) {
  const [tempData, setTempData] = useState(entry.data);

  const handleSaveEdit = () => {
    for (const key of Object.keys(tempData)) {
      const field = key as keyof CompanyImportData;
      if (tempData[field] !== entry.data[field]) {
        onDataChange(field, tempData[field] || '');
      }
    }
  };

  return (
    <div className="border rounded-lg shadow-sm bg-muted/30">
      <div className="flex items-center gap-3 p-3 border-b bg-background">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex-shrink-0 w-8 h-6 bg-slate-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-slate-600">#{index + 1}</span>
          </div>
          <Checkbox checked={entry.selected} onCheckedChange={onToggle} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">Editing Company</span>
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
        <FormInput
          label="Company Name"
          id="companyName"
          value={tempData.name}
          onChange={e => setTempData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Company Name"
        />
        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="Email"
            id="companyEmail"
            value={tempData.email || ''}
            onChange={e => setTempData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Email (optional)"
            type="email"
          />
          <FormInput
            label="Phone"
            id="companyPhone"
            value={tempData.phoneNumber || ''}
            onChange={e => setTempData(prev => ({ ...prev, phoneNumber: e.target.value }))}
            placeholder="Phone (optional)"
          />
        </div>
        <FormInput
          label="Website"
          id="companyWebsite"
          value={tempData.website || ''}
          onChange={e => setTempData(prev => ({ ...prev, website: e.target.value }))}
          placeholder="Website (optional)"
        />
        <FormInput
          label="Description"
          id="companyDescription"
          value={tempData.description || ''}
          onChange={e => setTempData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Description (optional)"
        />
        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="City"
            id="companyCity"
            value={tempData.city || ''}
            onChange={e => setTempData(prev => ({ ...prev, city: e.target.value }))}
            placeholder="City (optional)"
          />
          <FormInput
            label="Country"
            id="companyCountry"
            value={tempData.country || ''}
            onChange={e => setTempData(prev => ({ ...prev, country: e.target.value }))}
            placeholder="Country (optional)"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormInput
            label="Address"
            id="companyAddress"
            value={tempData.address || ''}
            onChange={e => setTempData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="Address (optional)"
          />
          <FormInput
            label="Post Code"
            id="companyPostCode"
            value={tempData.postCode || ''}
            onChange={e => setTempData(prev => ({ ...prev, postCode: e.target.value }))}
            placeholder="Post Code (optional)"
          />
        </div>
      </div>
    </div>
  );
}
