import { Badge } from '@tradelink/ui/components/badge';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { Checkbox } from '@tradelink/ui/components/checkbox';
import { AlertTriangle, Building2, Loader2, Users } from '@tradelink/ui/icons';
import { CompanySelector } from 'components/company-selector/CompanySelector';

import type { CompanyImportData, ContactImportData, ImportEntry, ImportPreviewResponse } from './types';

interface DataPreviewStepProps {
  previewData: ImportPreviewResponse | null;
  isLoading: boolean;
  error: string | null;
  onEntryToggle: (type: 'companies' | 'contacts', index: number) => void;
  onCompanyChange: (contactIndex: number, companyId: number | null) => void;
  onNext: () => void;
  onBack: () => void;
}

export function DataPreviewStep({ previewData, isLoading, error, onEntryToggle, onCompanyChange, onNext, onBack }: DataPreviewStepProps) {
  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-lg font-medium">Processing your data...</p>
            <p className="text-sm text-muted-foreground">This may take a moment</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="py-12">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Processing Error</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={onBack} variant="outline">
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!previewData) {
    return null;
  }

  const selectedCompanies = previewData.companies.filter(entry => entry.selected).length;
  const selectedContacts = previewData.contacts.filter(entry => entry.selected).length;
  const hasSelections = selectedCompanies > 0 || selectedContacts > 0;

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Summary */}
      <Card className="flex-shrink-0">
        <CardHeader>
          <CardTitle>Import Preview</CardTitle>
          <p className="text-sm text-muted-foreground">
            Review the data to be imported. You can select which entries to import and modify company assignments.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-500" />
              <span className="font-medium">
                {selectedCompanies} of {previewData.companies.length} companies
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              <span className="font-medium">
                {selectedContacts} of {previewData.contacts.length} contacts
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scrollable data area */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {/* Companies */}
        {previewData.companies.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Companies ({previewData.companies.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {previewData.companies.map((entry, index) => (
                  <CompanyEntryRow key={index} entry={entry} onToggle={() => onEntryToggle('companies', index)} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contacts */}
        {previewData.contacts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Contacts ({previewData.contacts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {previewData.contacts.map((entry, index) => (
                  <ContactEntryRow
                    key={index}
                    entry={entry}
                    onToggle={() => onEntryToggle('contacts', index)}
                    onCompanyChange={companyId => onCompanyChange(index, companyId)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0 pt-4 border-t">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!hasSelections} className="flex-1">
          Import Selected ({selectedCompanies + selectedContacts} items)
        </Button>
      </div>
    </div>
  );
}

interface CompanyEntryRowProps {
  entry: ImportEntry<CompanyImportData>;
  onToggle: () => void;
}

function CompanyEntryRow({ entry, onToggle }: CompanyEntryRowProps) {
  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg">
      <Checkbox checked={entry.selected} onCheckedChange={onToggle} />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{entry.data.name}</span>
          <Badge variant={entry.action === 'create' ? 'default' : 'secondary'}>{entry.action === 'create' ? 'New' : 'Update'}</Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {entry.data.email && <span>{entry.data.email}</span>}
          {entry.data.city && <span> • {entry.data.city}</span>}
        </div>
      </div>
    </div>
  );
}

interface ContactEntryRowProps {
  entry: ImportEntry<ContactImportData>;
  onToggle: () => void;
  onCompanyChange: (companyId: number | null) => void;
}

function ContactEntryRow({ entry, onToggle, onCompanyChange }: ContactEntryRowProps) {
  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg">
      <Checkbox checked={entry.selected} onCheckedChange={onToggle} />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {entry.data.firstName} {entry.data.lastName}
          </span>
          <Badge variant={entry.action === 'create' ? 'default' : 'secondary'}>{entry.action === 'create' ? 'New' : 'Update'}</Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {entry.data.email}
          {entry.data.jobTitle && <span> • {entry.data.jobTitle}</span>}
        </div>
        {entry.selected && (
          <div className="mt-2">
            <CompanySelector
              value={entry.matchedCompany?.id?.toString()}
              onValueChange={companyId => onCompanyChange(companyId ? Number.parseInt(companyId) : null)}
              placeholder="Select a company (optional)"
            />
          </div>
        )}
      </div>
    </div>
  );
}
