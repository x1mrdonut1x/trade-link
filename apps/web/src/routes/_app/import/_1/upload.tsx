import { createFileRoute, useNavigate } from '@tanstack/react-router';
import type { ImportFieldMapping, ImportFieldMappings } from '@tradelink/shared';
import { Button } from '@tradelink/ui/components/button';
import { Label } from '@tradelink/ui/components/label';
import { AlertTriangle, Upload } from '@tradelink/ui/icons';
import { useImportContext } from 'context';
import type { CsvColumn, ImportType } from 'context/import-context';
import Papa from 'papaparse';
import { useState } from 'react';

export const Route = createFileRoute('/_app/import/_1/upload')({
  component: UploadDataPage,
});

const parseCSV = (file: File): Promise<CsvColumn[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      preview: 50, // Only parse the first 10 rows
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

        resolve(columns);
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

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setError(null);

    let columns: CsvColumn[] = [];

    try {
      setIsLoading(true);
      columns = await parseCSV(file);

      // Store the file in context
      importContext.setCsvFile(file);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to parse CSV file');
    } finally {
      setIsLoading(false);
    }

    // Auto-map some common fields
    const autoMappings = createAutoMappings(columns, importContext.importType);
    importContext.setCsvColumns(columns);
    importContext.setFieldMappings(autoMappings);
  };

  return (
    <>
      {error && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
          <div>
            <p className="font-medium text-sm">Error</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      )}
      <div>
        <Label htmlFor="importType">Import Type</Label>
        <select
          id="importType"
          value={importContext.importType}
          onChange={e => importContext.setImportType(e.target.value as ImportType)}
          className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md"
        >
          <option value="mixed">Auto-detect (Companies and Contacts)</option>
          <option value="companies">Companies Only</option>
          <option value="contacts">Contacts Only</option>
        </select>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" id="file-upload" />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          {selectedFile ? (
            <div>
              <p className="text-lg font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium">Drop your CSV file here or click to browse</p>
              <p className="text-sm text-muted-foreground">Only CSV files are supported</p>
            </div>
          )}
        </label>
      </div>
      <div className="flex gap-2 pt-4 flex-shrink-0 border-t justify-end">
        <Button onClick={() => navigate({ to: '/import/map' })} disabled={!selectedFile} loading={isLoading}>
          Next
        </Button>
      </div>
    </>
  );
}
