import { type LinkProps } from '@tanstack/react-router';
import type { ImportExecuteResponse, ImportFieldMappings, ImportPreviewResponse } from '@tradelink/shared';
import { createContext, useContext, useState, type ReactNode } from 'react';

export interface ImportStep {
  index: number;
  url: LinkProps['to'];
  header?: React.ReactNode;
  title: string;
  description: string;
}

export interface CsvColumn {
  name: string;
  values: string[];
}

export type ImportType = 'companies' | 'contacts' | 'mixed';

interface ImportContextValue {
  // CSV file from upload step
  selectedRawFile?: File;
  setSelectedRawFile: (file?: File) => void;

  // CSV file from upload step
  csvFile?: Blob;
  setCsvFile: (file?: Blob) => void;

  // CSV data from upload step
  csvColumns: CsvColumn[];
  setCsvColumns: (columns: CsvColumn[]) => void;

  // Import type selection
  importType: ImportType;
  setImportType: (type: ImportType) => void;

  // Field mappings from map step
  fieldMappings: ImportFieldMappings;
  setFieldMappings: (mappings: ImportFieldMappings) => void;

  // Preview data from map step
  previewData?: ImportPreviewResponse;
  setPreviewData: (data: ImportPreviewResponse) => void;

  // Preview data from map step
  importStats?: ImportExecuteResponse['stats'];
  setImportStats: (data: ImportExecuteResponse['stats']) => void;

  // Helper to clear all data
  clearImportData: () => void;

  // Helper to remove entries with duplicate emails
  removeDuplicateEmailEntries: (email: string, type: 'company' | 'contact', rowsToRemove: number[]) => void;
}

const ImportContext = createContext<ImportContextValue | null>(null);

interface ImportProviderProps {
  children: ReactNode;
}

export function ImportProvider({ children }: ImportProviderProps) {
  const [selectedRawFile, setSelectedRawFile] = useState<File>();
  const [csvFile, setCsvFile] = useState<Blob>();
  const [csvColumns, setCsvColumns] = useState<CsvColumn[]>([]);
  const [importType, setImportType] = useState<ImportType>('mixed');
  const [fieldMappings, setFieldMappings] = useState<ImportFieldMappings>({
    companyMappings: [],
    contactMappings: [],
  });
  const [previewData, setPreviewData] = useState<ImportPreviewResponse>();
  const [importStats, setImportStats] = useState<ImportExecuteResponse['stats']>();

  const clearImportData = () => {
    setCsvFile(undefined);
    setCsvColumns([]);
    setImportType('mixed');
    setFieldMappings({
      companyMappings: [],
      contactMappings: [],
    });
    setPreviewData(undefined);
  };

  const removeDuplicateEmailEntries = (email: string, type: 'company' | 'contact', rowsToRemove: number[]) => {
    if (!previewData) return;

    setPreviewData(prev => {
      if (!prev) return;

      // Update entry selections
      if (type === 'company') {
        for (const [index] of prev.companies.entries()) {
          if (rowsToRemove.some(row => row - 1 === index)) {
            prev.companies[index].selected = false;
          }
        }
      } else {
        for (const [index] of prev.contacts.entries()) {
          if (rowsToRemove.some(row => row - 1 === index)) prev.contacts[index].selected = false;
        }
      }

      // Update duplicateEmailErrors
      const updatedDuplicateEmailErrors =
        prev.duplicateEmailErrors
          ?.map(error => {
            if (error.email === email && error.type === type) {
              // Remove the specified rows from this error
              const remainingRows = error.rows.filter(row => !rowsToRemove.includes(row));

              // If only one row remains or no rows remain, this is no longer a duplicate
              if (remainingRows.length <= 1) {
                return null; // Mark for removal
              }

              return {
                ...error,
                rows: remainingRows,
              };
            }
            return error;
          })
          .filter(error => error !== null) || [];

      return {
        ...prev,
        duplicateEmailErrors: updatedDuplicateEmailErrors,
      };
    });
  };

  const value: ImportContextValue = {
    selectedRawFile,
    setSelectedRawFile,
    csvFile,
    setCsvFile,
    csvColumns,
    setCsvColumns,
    importType,
    setImportType,
    fieldMappings,
    setFieldMappings,
    previewData,
    setPreviewData,
    clearImportData,
    importStats,
    setImportStats,
    removeDuplicateEmailEntries,
  };

  return <ImportContext.Provider value={value}>{children}</ImportContext.Provider>;
}

export function useImportContext() {
  const context = useContext(ImportContext);
  if (!context) {
    throw new Error('useImportContext must be used within an ImportProvider');
  }
  return context;
}
