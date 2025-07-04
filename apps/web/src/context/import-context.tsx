import type { LinkProps } from '@tanstack/react-router';
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
}

const ImportContext = createContext<ImportContextValue | null>(null);

interface ImportProviderProps {
  children: ReactNode;
}

export function ImportProvider({ children }: ImportProviderProps) {
  const [csvColumns, setCsvColumns] = useState<CsvColumn[]>([]);
  const [importType, setImportType] = useState<ImportType>('mixed');
  const [fieldMappings, setFieldMappings] = useState<ImportFieldMappings>({
    companyMappings: [],
    contactMappings: [],
  });
  const [previewData, setPreviewData] = useState<ImportPreviewResponse>();
  const [importStats, setImportStats] = useState<ImportExecuteResponse['stats']>();

  const clearImportData = () => {
    setCsvColumns([]);
    setImportType('mixed');
    setFieldMappings({
      companyMappings: [],
      contactMappings: [],
    });
    setPreviewData(undefined);
  };

  const value: ImportContextValue = {
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
