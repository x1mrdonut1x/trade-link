import { createFileRoute, useNavigate } from '@tanstack/react-router';
import type { ImportFieldMapping, ImportFieldMappings } from '@tradelink/shared';
import { Button } from '@tradelink/ui/components/button';
import { Label } from '@tradelink/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@tradelink/ui/components/select';
import { FileUpload } from 'components/file-upload';
import { useImportContext } from 'context';
import type { CsvColumn, ImportType } from 'context/import-context';
import Papa from 'papaparse';
import { useState } from 'react';

export const Route = createFileRoute('/_app/import/_1/upload')({
  component: UploadDataPage,
});

const parseCSV = (file: File): Promise<{ columns: CsvColumn[]; slicedFile: Blob }> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      preview: 10_000,
      complete: results => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`));
          return;
        }

        const data = results.data as Record<string, string>[];
        const columns: CsvColumn[] = [];

        // Get column names from the first row
        if (data.length > 0) {
          const columnNames = Object.keys(data[0]);

          for (const columnName of columnNames) {
            const values = data.map(row => row[columnName] || '').filter(value => value.trim() !== '');

            columns.push({
              name: columnName,
              values: values,
            });
          }
        }

        const slicedFile = new Blob([Papa.unparse(data)], { type: 'text/csv' });

        resolve({ columns, slicedFile });
      },
      error: error => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      },
    });
  });
};

function UploadDataPage() {
  const navigate = useNavigate();
  const importContext = useImportContext();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createAutoMappings = (columns: CsvColumn[], importType: ImportType): ImportFieldMappings => {
    const companyMappings: ImportFieldMapping[] = [];
    const contactMappings: ImportFieldMapping[] = [];

    for (const [columnIndex, column] of columns.entries()) {
      const columnName = column.name.toLowerCase().trim();

      // Auto-map common field names
      if (columnName.includes('first') && columnName.includes('name')) {
        contactMappings.push({ csvColumnIndex: columnIndex, targetField: 'firstName' });
      } else if (columnName.includes('last') && columnName.includes('name')) {
        contactMappings.push({ csvColumnIndex: columnIndex, targetField: 'lastName' });
      } else
        switch (columnName) {
          case 'email': {
            if (importType === 'contacts' || importType === 'mixed') {
              contactMappings.push({ csvColumnIndex: columnIndex, targetField: 'email' });
            }
            if (importType === 'companies' || importType === 'mixed') {
              companyMappings.push({ csvColumnIndex: columnIndex, targetField: 'email' });
            }

            break;
          }
          case 'company':
          case 'company name': {
            if (importType === 'contacts' || importType === 'mixed') {
              contactMappings.push({ csvColumnIndex: columnIndex, targetField: 'companyName' });
            }
            if (importType === 'companies' || importType === 'mixed') {
              companyMappings.push({ csvColumnIndex: columnIndex, targetField: 'name' });
            }

            break;
          }
          case 'phone': {
            if (importType === 'contacts' || importType === 'mixed') {
              contactMappings.push({ csvColumnIndex: columnIndex, targetField: 'phoneNumber' });
            }
            if (importType === 'companies' || importType === 'mixed') {
              companyMappings.push({ csvColumnIndex: columnIndex, targetField: 'phoneNumber' });
            }

            break;
          }
          case 'city': {
            if (importType === 'contacts' || importType === 'mixed') {
              contactMappings.push({ csvColumnIndex: columnIndex, targetField: 'city' });
            }
            if (importType === 'companies' || importType === 'mixed') {
              companyMappings.push({ csvColumnIndex: columnIndex, targetField: 'city' });
            }

            break;
          }
          case 'country': {
            if (importType === 'contacts' || importType === 'mixed') {
              contactMappings.push({ csvColumnIndex: columnIndex, targetField: 'country' });
            }
            if (importType === 'companies' || importType === 'mixed') {
              companyMappings.push({ csvColumnIndex: columnIndex, targetField: 'country' });
            }

            break;
          }
        }
    }

    return {
      companyMappings,
      contactMappings,
    };
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setError(null);

    try {
      setIsLoading(true);
      const { columns, slicedFile } = await parseCSV(file);

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
        selectedFile={selectedFile}
        isLoading={isLoading}
        error={error}
        accept=".csv"
        maxSize={10}
      />

      <div className="flex gap-2 pt-4 flex-shrink-0 border-t justify-end">
        <Button onClick={() => navigate({ to: '/import/map' })} disabled={!selectedFile} loading={isLoading}>
          Next
        </Button>
      </div>
    </>
  );
}
