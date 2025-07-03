import { createFileRoute } from '@tanstack/react-router';
import { ImportAPI } from 'api/import/import.service';
import {
  DataPreviewStep,
  FieldMappingStep,
  FileUploadStep,
  ImportCompleteStep,
  ImportHelpSidebar,
  parseCSV,
  type CsvColumn,
  type FieldMapping,
  type ImportPreviewResponse,
  type ImportStep,
  type ImportType,
} from 'components/import';
import { PageHeader } from 'components/page-header/PageHeader';
import { useState } from 'react';

export const Route = createFileRoute('/_app/import/')({
  component: ImportDataPage,
});

function ImportDataPage() {
  // State for the import process
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<ImportType>('mixed');
  const [csvColumns, setCsvColumns] = useState<CsvColumn[]>([]);
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [previewData, setPreviewData] = useState<ImportPreviewResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importStats, setImportStats] = useState<any>(null);

  const importSteps: ImportStep[] = [
    { id: 1, title: 'Upload File', description: 'Select your CSV file', completed: currentStep > 1, active: currentStep === 1 },
    { id: 2, title: 'Map Fields', description: 'Match your columns to our fields', completed: currentStep > 2, active: currentStep === 2 },
    { id: 3, title: 'Review Data', description: 'Preview and validate your data', completed: currentStep > 3, active: currentStep === 3 },
    { id: 4, title: 'Import', description: 'Import your data into the system', completed: importComplete, active: currentStep === 4 },
  ];

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setError(null);

    try {
      const columns = await parseCSV(file);
      setCsvColumns(columns);

      // Auto-map some common fields
      const autoMappings: FieldMapping[] = [];
      columns.forEach(column => {
        const columnName = column.name.toLowerCase().trim();

        // Auto-map common field names
        if (columnName.includes('first') && columnName.includes('name')) {
          autoMappings.push({ csvColumn: column.name, targetField: 'firstName' });
        } else if (columnName.includes('last') && columnName.includes('name')) {
          autoMappings.push({ csvColumn: column.name, targetField: 'lastName' });
        } else if (columnName === 'email') {
          autoMappings.push({ csvColumn: column.name, targetField: 'email' });
        } else if (columnName === 'company' || columnName === 'company name') {
          autoMappings.push({ csvColumn: column.name, targetField: importType === 'contacts' ? 'companyName' : 'name' });
        } else if (columnName === 'phone') {
          autoMappings.push({ csvColumn: column.name, targetField: 'phoneNumber' });
        } else if (columnName === 'city') {
          autoMappings.push({ csvColumn: column.name, targetField: 'city' });
        } else if (columnName === 'country') {
          autoMappings.push({ csvColumn: column.name, targetField: 'country' });
        }
      });

      setFieldMappings(autoMappings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
    }
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleProcessData = async () => {
    if (!csvColumns.length || !fieldMappings.length) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Create the request for the backend
      const csvData = csvColumns[0].values.map((_, rowIndex) => csvColumns.map(col => col.values[rowIndex] || ''));

      const processResponse = await ImportAPI.processImport({
        csvData,
        fieldMappings,
        importType,
      });

      setPreviewData(processResponse);
      setCurrentStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process data');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEntryToggle = (type: 'companies' | 'contacts', index: number) => {
    if (!previewData) return;

    const updatedData = { ...previewData };
    if (type === 'companies') {
      updatedData.companies[index].selected = !updatedData.companies[index].selected;
    } else {
      updatedData.contacts[index].selected = !updatedData.contacts[index].selected;
    }
    setPreviewData(updatedData);
  };

  const handleCompanyChange = (contactIndex: number, companyId: number | null) => {
    if (!previewData) return;

    const updatedData = { ...previewData };
    if (companyId) {
      updatedData.contacts[contactIndex].matchedCompany = { id: companyId, name: 'Selected Company' };
    } else {
      updatedData.contacts[contactIndex].matchedCompany = undefined;
    }
    setPreviewData(updatedData);
  };

  const handleImport = async () => {
    if (!previewData) return;

    setIsImporting(true);
    setError(null);

    try {
      const selectedCompanies = previewData.companies.filter(entry => entry.selected);
      const selectedContacts = previewData.contacts.filter(entry => entry.selected);

      const executeResponse = await ImportAPI.executeImport({
        companies: selectedCompanies.map(entry => ({
          data: entry.data,
          action: entry.action,
          existingId: entry.existingId,
        })),
        contacts: selectedContacts.map(entry => ({
          data: entry.data,
          action: entry.action,
          existingId: entry.existingId,
          companyId: entry.matchedCompany?.id,
        })),
      });

      setImportStats(executeResponse.stats);
      setImportComplete(true);
      setCurrentStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import data');
    } finally {
      setIsImporting(false);
    }
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setSelectedFile(null);
    setCsvColumns([]);
    setFieldMappings([]);
    setPreviewData(null);
    setImportComplete(false);
    setError(null);
    setImportStats(null);
  };

  const handleDownloadTemplate = async (type: string) => {
    try {
      await ImportAPI.downloadTemplate(type);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download template');
    }
  };

  return (
    <>
      <PageHeader title="Import Data" />

      <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
        {currentStep <= 3 && !importComplete && (
          <div className="bg-card border rounded-lg p-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Import Progress</h3>
              <span className="text-sm text-muted-foreground">Step {currentStep} of 4</span>
            </div>
            <div className="flex items-center gap-4">
              {importSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center min-w-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step.completed ? 'bg-green-500 text-white' : step.active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step.completed ? '✓' : step.id}
                    </div>
                    <span
                      className={`text-xs mt-1 font-medium text-center whitespace-nowrap ${
                        step.active ? 'text-blue-600' : step.completed ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < importSteps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-3 ${step.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          {currentStep === 1 && (
            <div className="grid gap-6 lg:grid-cols-4 h-full">
              <div className="lg:col-span-3">
                <FileUploadStep
                  selectedFile={selectedFile}
                  importType={importType}
                  onFileSelect={handleFileSelect}
                  onImportTypeChange={setImportType}
                  onNext={handleNext}
                />
              </div>
              <div>
                <ImportHelpSidebar onDownloadTemplate={handleDownloadTemplate} />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="h-full">
              <FieldMappingStep
                csvColumns={csvColumns}
                fieldMappings={fieldMappings}
                importType={importType}
                onMappingChange={setFieldMappings}
                onNext={handleProcessData}
                onBack={handleBack}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="h-full">
              <DataPreviewStep
                previewData={previewData}
                isLoading={isProcessing}
                error={error}
                onEntryToggle={handleEntryToggle}
                onCompanyChange={handleCompanyChange}
                onNext={handleImport}
                onBack={handleBack}
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="h-full">
              <ImportCompleteStep
                isImporting={isImporting}
                importComplete={importComplete}
                importStats={importStats}
                error={error}
                onStartOver={handleStartOver}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
