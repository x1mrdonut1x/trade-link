import type { CompanyImportData, ImportEntry } from '@tradelink/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@tradelink/ui/components/select';
import { Building2, Filter } from '@tradelink/ui/icons';
import { useImportContext } from 'context';
import { useState } from 'react';
import { CompanyEntryRow } from './CompanyEntryRow';

type FilterOption = 'all' | 'new' | 'update';

export function CompaniesList() {
  const importContext = useImportContext();

  const [companyFilter, setCompanyFilter] = useState<FilterOption>('all');

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

  const handleCompanyDataChange = (index: number, field: keyof CompanyImportData, value: string) => {
    if (!previewData) return;

    const updatedData = { ...previewData };
    updatedData.companies[index].data = {
      ...updatedData.companies[index].data,
      [field]: value,
    };
    importContext.setPreviewData(updatedData);
  };

  // Filter functions
  const filterCompanies = (companies: ImportEntry<CompanyImportData>[], filter: FilterOption) => {
    if (filter === 'all') return companies;
    return companies.filter(entry => entry.action === (filter === 'new' ? 'create' : 'update'));
  };

  if (!previewData) return;

  const filteredCompanies = filterCompanies(previewData.companies, companyFilter);

  return (
    <Card className="flex-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Companies ({filteredCompanies.length} of {previewData.companies.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={companyFilter} onValueChange={(value: FilterOption) => setCompanyFilter(value)}>
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
          {filteredCompanies.map(entry => {
            const originalIndex = previewData.companies.indexOf(entry);
            return (
              <CompanyEntryRow
                key={originalIndex}
                entry={entry}
                onToggle={() => handleEntryToggle('companies', originalIndex)}
                onDataChange={(field, value) => handleCompanyDataChange(originalIndex, field, value)}
              />
            );
          })}
        </div>
        {filteredCompanies.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">No companies match the selected filter.</div>
        )}
      </CardContent>
    </Card>
  );
}
