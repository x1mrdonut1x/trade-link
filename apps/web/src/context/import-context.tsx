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

  // Helper to remove entries with duplicate names
  removeDuplicateNameEntries: (name: string, type: 'company', rowsToRemove: number[]) => void;
}

const ImportContext = createContext<ImportContextValue | null>(null);

interface ImportProviderProps {
  children: ReactNode;
}

export function ImportProvider({ children }: ImportProviderProps) {
  const [selectedRawFile, setSelectedRawFile] = useState<ImportContextValue['selectedRawFile']>();
  const [csvFile, setCsvFile] = useState<ImportContextValue['csvFile']>();
  const [csvColumns, setCsvColumns] = useState<ImportContextValue['csvColumns']>([]);
  const [importType, setImportType] = useState<ImportContextValue['importType']>('mixed');
  const [fieldMappings, setFieldMappings] = useState<ImportContextValue['fieldMappings']>({
    companyMappings: [],
    contactMappings: [],
  });
  const [previewData, setPreviewData] = useState<ImportContextValue['previewData']>();
  const [importStats, setImportStats] = useState<ImportContextValue['importStats']>();

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
      if (!prev) return prev;

      // Update entry selections by marking specified rows as unselected
      const entries = type === 'company' ? prev.companies : prev.contacts;
      for (const [index, entry] of entries.entries()) {
        if (rowsToRemove.includes(index + 1)) {
          entry.selected = false;
        }
      }

      // Update duplicateEmailErrors by removing specified rows and cleaning up resolved duplicates
      const updatedDuplicateEmailErrors =
        prev.duplicateEmailErrors
          ?.map(error => {
            if (error.email !== email || error.type !== type) return error;

            const remainingRows = error.rows.filter(row => !rowsToRemove.includes(row));
            return remainingRows.length > 1 ? { ...error, rows: remainingRows } : null;
          })
          .filter((error): error is NonNullable<typeof error> => error !== null) || [];

      return {
        ...prev,
        duplicateEmailErrors: updatedDuplicateEmailErrors,
      };
    });
  };

  const removeDuplicateNameEntries = (name: string, type: 'company', rowsToRemove: number[]) => {
    if (!previewData) return;

    setPreviewData(prev => {
      if (!prev) return prev;

      // Update entry selections by marking specified rows as unselected
      const entries = prev.companies;
      for (const [index, entry] of entries.entries()) {
        if (rowsToRemove.includes(index + 1)) {
          entry.selected = false;
        }
      }

      // Update duplicateNameErrors by removing specified rows and cleaning up resolved duplicates
      const updatedDuplicateNameErrors =
        prev.duplicateNameErrors
          ?.map(error => {
            if (error.name !== name || error.type !== type) return error;

            const remainingRows = error.rows.filter(row => !rowsToRemove.includes(row));
            return remainingRows.length > 1 ? { ...error, rows: remainingRows } : null;
          })
          .filter((error): error is NonNullable<typeof error> => error !== null) || [];

      return {
        ...prev,
        duplicateNameErrors: updatedDuplicateNameErrors,
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
    removeDuplicateNameEntries,
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
