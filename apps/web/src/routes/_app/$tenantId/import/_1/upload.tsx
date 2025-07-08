import { createFileRoute, useNavigate } from '@tanstack/react-router';
import type { CompanyImportData, ContactImportData, ImportFieldMapping, ImportFieldMappings } from '@tradelink/shared';
import { Button } from '@tradelink/ui/components/button';
import { Label } from '@tradelink/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@tradelink/ui/components/select';
import { FileUpload } from 'components/file-upload';
import { useImportContext } from 'context';
import type { CsvColumn, ImportType } from 'context/import-context';
import { useState } from 'react';
import { parseCSV } from '../-utils/util';

export const Route = createFileRoute('/_app/$tenantId/import/_1/upload')({
  component: UploadDataPage,
});

function UploadDataPage() {
  const navigate = useNavigate();
  const importContext = useImportContext();

  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const createAutoMappings = (columns: CsvColumn[], importType: ImportType): ImportFieldMappings => {
    const companyMappings: ImportFieldMapping<CompanyImportData>[] = [];
    const contactMappings: ImportFieldMapping<ContactImportData>[] = [];

    const isCompanyOrMixed = importType === 'companies' || importType === 'mixed';
    const isContactOrMixed = importType === 'contacts' || importType === 'mixed';

    const fieldMappingRules: {
      columnMatches: (name: string) => boolean;
      contactField?: keyof ContactImportData;
      companyField?: keyof CompanyImportData;
    }[] = [
      {
        columnMatches: (name: string) => name.includes('first') && name.includes('name'),
        contactField: 'firstName',
      },
      {
        columnMatches: (name: string) => name.includes('last') && name.includes('name'),
        contactField: 'lastName',
      },
      {
        columnMatches: (name: string) => name.includes('company'),
        contactField: 'companyName',
        companyField: 'name',
      },
      {
        columnMatches: (name: string) => name.includes('country'),
        contactField: 'country',
        companyField: 'country',
      },
      {
        columnMatches: (name: string) => name.includes('city'),
        contactField: 'city',
        companyField: 'city',
      },
      {
        columnMatches: (name: string) => name.includes('phone'),
        contactField: 'phoneNumber',
        companyField: 'phoneNumber',
      },
      {
        columnMatches: (name: string) => name.includes('email'),
        contactField: 'email',
        companyField: 'email',
      },
      {
        columnMatches: (name: string) => name.includes('create'),
        contactField: 'createdAt',
        companyField: 'createdAt',
      },
    ];

    const addMapping = (columnIndex: number, rule: (typeof fieldMappingRules)[0]) => {
      if (rule.contactField && isContactOrMixed) {
        // Check if this field is already mapped
        const existingMapping = contactMappings.find(m => m.targetField === rule.contactField);
        if (!existingMapping) {
          contactMappings.push({
            csvColumnIndex: columnIndex,
            targetField: rule.contactField,
          });
        }
      }
      if (rule.companyField && isCompanyOrMixed) {
        // Check if this field is already mapped
        const existingMapping = companyMappings.find(m => m.targetField === rule.companyField);
        if (!existingMapping) {
          companyMappings.push({
            csvColumnIndex: columnIndex,
            targetField: rule.companyField,
          });
        }
      }
    };

    for (const [columnIndex, column] of columns.entries()) {
      const columnName = column.name.toLowerCase().trim();

      const matchingRule = fieldMappingRules.find(rule => rule.columnMatches(columnName));

      if (matchingRule) {
        addMapping(columnIndex, matchingRule);
      }
    }

    return {
      companyMappings,
      contactMappings,
    };
  };

  const handleFileSelect = async (file: File) => {
    importContext.setSelectedRawFile(file);
    setError(undefined);

    try {
      setIsLoading(true);
      const { columns, slicedFile } = await parseCSV(file, 100);

      // Store the file in context
      importContext.setCsvFile(slicedFile);

      // Auto-map some common fields
      const autoMappings = createAutoMappings(columns, importContext.importType);
      importContext.setCsvColumns(columns);
      importContext.setFieldMappings(autoMappings);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to parse CSV file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div>
        <Label htmlFor="importType">Import Type</Label>
        <Select
          value={importContext.importType}
          onValueChange={value => importContext.setImportType(value as ImportType)}
        >
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Select import type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mixed">Auto-detect (Companies and Contacts)</SelectItem>
            <SelectItem value="companies">Companies Only</SelectItem>
            <SelectItem value="contacts">Contacts Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <FileUpload
        onFileSelect={handleFileSelect}
        selectedFile={importContext.selectedRawFile}
        isLoading={isLoading}
        error={error}
        accept=".csv"
        maxSize={10}
      />

      <div className="flex gap-2 pt-4 flex-shrink-0 border-t justify-end">
        <Button
          onClick={() => navigate({ to: '/import/map' })}
          disabled={!importContext.selectedRawFile}
          loading={isLoading}
        >
          Next
        </Button>
      </div>
    </>
  );
}
