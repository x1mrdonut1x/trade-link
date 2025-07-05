import { createFileRoute, useNavigate } from '@tanstack/react-router';
import type { ImportExecuteResponse } from '@tradelink/shared';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { Building2, Loader2, Users } from '@tradelink/ui/icons';
import { importAPI } from 'api/import/import.service';
import { Alert } from 'components/ui/alert';
import { useImportContext } from 'context';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import { CompaniesList } from './-components/companies/CompaniesList';
import { ContactsList } from './-components/contacts/ContactsList';

export const Route = createFileRoute('/_app/import/_3/review')({
  component: DataPreviewPage,
});

export function DataPreviewPage() {
  const navigate = useNavigate();
  const importContext = useImportContext();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importErrorDetails, setImportErrorDetails] = useState<ImportExecuteResponse['errors']>([]);

  const { previewData, fieldMappings } = importContext;

  useEffect(() => {
    if (!previewData) {
      navigate({ to: '/import/map' });
    }
  }, [navigate, previewData]);

  // Helper function to generate CSV data for companies
  const generateCompanyCSV = (selectedCompanies: NonNullable<typeof previewData>['companies']): string => {
    if (selectedCompanies.length === 0) return '';

    // Get all mapped company fields
    const companyFields = fieldMappings.companyMappings.map(mapping => mapping.targetField);

    // Create header row
    const headerRow = companyFields;

    // Create data rows
    const dataRows = selectedCompanies.map(entry => {
      return companyFields.map(field => {
        const value = entry.data[field as keyof typeof entry.data];
        return value ?? '';
      });
    });

    return Papa.unparse([headerRow, ...dataRows]);
  };

  // Helper function to generate CSV data for contacts
  const generateContactCSV = (selectedContacts: NonNullable<typeof previewData>['contacts']): string => {
    if (selectedContacts.length === 0) return '';

    // Get all mapped contact fields
    const contactFields = fieldMappings.contactMappings.map(mapping => mapping.targetField);

    // Create header row
    const headerRow = contactFields;

    // Create data rows
    const dataRows = selectedContacts.map(entry => {
      return contactFields.map(field => {
        const value = entry.data[field as keyof typeof entry.data];
        return value ?? '';
      });
    });

    return Papa.unparse([headerRow, ...dataRows]);
  };

  const handleImport = async () => {
    if (!previewData) return;

    setIsLoading(true);
    setError(null);

    try {
      const selectedCompanies = previewData.companies.filter(entry => entry.selected);
      const selectedContacts = previewData.contacts.filter(entry => entry.selected);

      // Generate CSV files for selected data
      const companyCsvData = generateCompanyCSV(selectedCompanies);
      const contactCsvData = generateContactCSV(selectedContacts);

      // Create Blob objects for CSV files
      const companyCsvFile = companyCsvData ? new Blob([companyCsvData], { type: 'text/csv' }) : undefined;
      const contactCsvFile = contactCsvData ? new Blob([contactCsvData], { type: 'text/csv' }) : undefined;

      // Get selected row indices (for backend tracking)
      const selectedCompanyRows = selectedCompanies
        .map((_, index) => index)
        .filter(index => selectedCompanies[index].selected);
      const selectedContactRows = selectedContacts
        .map((_, index) => index)
        .filter(index => selectedContacts[index].selected);

      const executeResponse = await importAPI.executeImport({
        fieldMappings,
        importType: importContext.importType,
        selectedCompanyRows,
        selectedContactRows,
        companyCsvFile,
        contactCsvFile,
      });

      if (executeResponse.success) {
        importContext.setImportStats(executeResponse.stats);
        navigate({ to: '/import/success' });
      } else {
        setError('Import failed with errors. Please review the details below.');
        setImportErrorDetails(executeResponse.errors || []);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to import data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
        <p className="text-lg font-medium">Processing your data...</p>
        <p className="text-sm text-muted-foreground">This may take a moment</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-2">
        <Alert
          variant="error"
          title="Processing Error"
          description={error}
          action={{
            label: 'Go Back',
            onClick: () => navigate({ to: '/import/map' }),
            variant: 'outline',
          }}
        />
        {importErrorDetails?.length &&
          importErrorDetails.map(error => (
            <Alert variant="warning" title={`Row: ${error.row}, Field: ${error.field}`} description={error.message} />
          ))}
      </div>
    );
  }

  if (!previewData) {
    return null;
  }

  const selectedCompanies = previewData.companies.filter(entry => entry.selected).length;
  const selectedContacts = previewData.contacts.filter(entry => entry.selected).length;
  const hasSelections = selectedCompanies > 0 || selectedContacts > 0;

  return (
    <div className="flex flex-col space-y-6">
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

      <div className="flex flex-col 2xl:flex-row overflow-y-auto gap-4">
        <CompaniesList />
        <ContactsList />
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0 pt-4 border-t">
        <Button variant="outline" onClick={() => navigate({ to: '/import/map' })}>
          Back
        </Button>
        <Button onClick={() => handleImport()} disabled={!hasSelections} className="flex-1">
          Import Selected ({selectedCompanies + selectedContacts} items)
        </Button>
      </div>
    </div>
  );
}
