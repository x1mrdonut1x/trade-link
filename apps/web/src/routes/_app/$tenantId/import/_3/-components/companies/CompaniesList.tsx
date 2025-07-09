import { useVirtualizer } from '@tanstack/react-virtual';
import type { CompanyImportData, ImportEntry } from '@tradelink/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@tradelink/ui/components/select';
import { Filter } from '@tradelink/ui/icons';
import { Empty } from 'components/empty/Empty';
import { CompanyIcon } from 'components/icons/CompanyIcon';
import { useImportContext } from 'context';
import { useRef, useState } from 'react';
import { CompanyEntryRow } from './CompanyEntryRow';

type FilterOption = 'all' | 'new' | 'update';

const filterCompanies = (companies: ImportEntry<CompanyImportData>[], filter: FilterOption) => {
  if (filter === 'all') return companies;
  return companies.filter(entry => entry.action === (filter === 'new' ? 'create' : 'update'));
};

export function CompaniesList() {
  const importContext = useImportContext();
  const parentRef = useRef<HTMLDivElement>(null);

  const [companyFilter, setCompanyFilter] = useState<FilterOption>('all');

  const { previewData } = importContext;

  // Calculate filtered companies
  const filteredCompanies = previewData ? filterCompanies(previewData.companies, companyFilter) : [];

  const virtualizer = useVirtualizer({
    count: filteredCompanies.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Initial estimate, will be measured dynamically
    overscan: 5,
    measureElement: element => {
      return element.getBoundingClientRect().height;
    },
  });

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

  const handleCompanyDataChange = <K extends keyof CompanyImportData>(
    index: number,
    field: K,
    value: CompanyImportData[K]
  ) => {
    if (!previewData) return;

    const updatedData = { ...previewData };
    updatedData.companies[index].data = {
      ...updatedData.companies[index].data,
      [field]: value,
    };
    importContext.setPreviewData(updatedData);
  };

  // Filter functions
  if (!previewData) return;

  return (
    <Card className="flex-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CompanyIcon className="h-5 w-5" />
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
        <div ref={parentRef} className="h-[400px] overflow-auto">
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map(virtualItem => {
              const entry = filteredCompanies[virtualItem.index];
              const originalIndex = previewData.companies.indexOf(entry);
              return (
                <div
                  key={virtualItem.key}
                  data-index={virtualItem.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <div className="pb-3">
                    <CompanyEntryRow
                      entry={entry}
                      index={originalIndex}
                      onToggle={() => handleEntryToggle('companies', originalIndex)}
                      onDataChange={(field, value) => handleCompanyDataChange(originalIndex, field, value)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {filteredCompanies.length === 0 && (
          <Empty icon={CompanyIcon} title="No companies found" description="No companies match the selected filter." />
        )}
      </CardContent>
    </Card>
  );
}
