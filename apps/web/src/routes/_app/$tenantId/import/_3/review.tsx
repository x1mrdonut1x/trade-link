import { createFileRoute, useNavigate } from '@tanstack/react-router';
import type { ImportExecuteResponse } from '@tradelink/shared';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { Building2, Loader2, Users } from '@tradelink/ui/icons';
import { importAPI } from 'api/import/api';
import { Alert } from 'components/ui/alert';
import { useImportContext } from 'context';
import Papa from 'papaparse';
import { useEffect, useState } from 'react';
import { CompaniesList } from './-components/companies/CompaniesList';
import { ContactsList } from './-components/contacts/ContactsList';
import { DuplicateWarning } from './-components/DuplicateWarning';

export const Route = createFileRoute('/_app/$tenantId/import/_3/review')({
  component: DataPreviewPage,
});

export function DataPreviewPage() {
  const navigate = useNavigate();
  const importContext = useImportContext();

  const { tenantId } = Route.useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importErrorDetails, setImportErrorDetails] = useState<ImportExecuteResponse['errors']>([]);

  const { previewData, fieldMappings } = importContext;

  useEffect(() => {
    if (!previewData) {
      navigate({ to: '/$tenantId/import/map', params: { tenantId } });
    }
  }, [navigate, previewData, tenantId]);

  const generateCSV = <T extends { data: Record<string, unknown>; existingId?: number; companyId?: number }>(
    selectedEntries: T[],
    mappings: Array<{ targetField: string; csvColumnIndex: number }>,
    includeCompanyId: boolean = false
  ): string => {
    if (selectedEntries.length === 0) return '';

    // Sort mappings by csvColumnIndex to ensure correct column order
    const sortedMappings = [...mappings].sort((a, b) => a.csvColumnIndex - b.csvColumnIndex);

    // Get all mapped fields in the correct order
    const fields = sortedMappings.map(mapping => mapping.targetField);

    // Add special fields for tracking existing records and company assignments
    const specialFields = ['__existingId'];
    if (includeCompanyId) {
      specialFields.push('__companyId');
    }

    // Create header row - use target field names as headers
    const headerRow = [...fields, ...specialFields];

    // Create data rows
    const dataRows = selectedEntries.map(entry => {
      const dataValues = fields.map(field => {
        const value = entry.data[field as keyof typeof entry.data];
        return value ?? '';
      });

      // Add special field values
      const specialValues = [
        entry.existingId?.toString() ?? '', // __existingId
      ];

      if (includeCompanyId) {
        specialValues.push(entry.companyId?.toString() ?? ''); // __companyId
      }

      return [...dataValues, ...specialValues];
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
      const companyCsvData = generateCSV(selectedCompanies, fieldMappings.companyMappings);
      const contactCsvData = generateCSV(selectedContacts, fieldMappings.contactMappings, true); // Include companyId for contacts

      // Create updated field mappings with sequential column indices
      const updatedFieldMappings = {
        companyMappings: [...fieldMappings.companyMappings]
          .sort((a, b) => a.csvColumnIndex - b.csvColumnIndex)
          .map((mapping, index) => ({
            ...mapping,
            csvColumnIndex: index,
          })),
        contactMappings: [...fieldMappings.contactMappings]
          .sort((a, b) => a.csvColumnIndex - b.csvColumnIndex)
          .map((mapping, index) => ({
            ...mapping,
            csvColumnIndex: index,
          })),
      };

      // Create Blob objects for CSV files
      const companyCsvFile = companyCsvData ? new Blob([companyCsvData], { type: 'text/csv' }) : undefined;
      const contactCsvFile = contactCsvData ? new Blob([contactCsvData], { type: 'text/csv' }) : undefined;

      // Get skipped row indices (for backend tracking)
      const skippedCompanyRows = previewData.companies
        .map((entry, index) => ({ entry, index }))
        .filter(({ entry }) => !entry.selected)
        .map(({ index }) => index);
      const skippedContactRows = previewData.contacts
        .map((entry, index) => ({ entry, index }))
        .filter(({ entry }) => !entry.selected)
        .map(({ index }) => index);

      const executeResponse = await importAPI(tenantId).executeImport({
        fieldMappings: updatedFieldMappings,
        importType: importContext.importType,
        skippedCompanyRows,
        skippedContactRows,
        companyCsvFile,
        contactCsvFile,
      });

      if (executeResponse.success) {
        importContext.setImportStats(executeResponse.stats);
        navigate({ to: '/$tenantId/import/success', params: { tenantId } });
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
            onClick: () => navigate({ to: '/$tenantId/import/map', params: { tenantId } }),
            variant: 'outline',
          }}
        />
        {importErrorDetails?.length &&
          importErrorDetails.map(error => <Alert variant="warning" description={error.message} />)}
      </div>
    );
  }

  if (!previewData) {
    return null;
  }

  const selectedCompanies = previewData.companies.filter(entry => entry.selected).length;
  const selectedContacts = previewData.contacts.filter(entry => entry.selected).length;
  const hasSelections = selectedCompanies > 0 || selectedContacts > 0;
  const hasDuplicateEmails = previewData.duplicateEmailErrors && previewData.duplicateEmailErrors.length > 0;
  const canImport = hasSelections && !hasDuplicateEmails;

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

      {/* Row limit warning */}
      {previewData.truncated && (
        <Alert
          variant="warning"
          title="Import Limited to 10,000 Rows"
          description={`Your CSV file contains ${previewData.totalRows?.toLocaleString()} rows, but we've limited your import to the first 10,000 rows to ensure optimal performance. If you need to import more data, consider splitting your file into smaller chunks.`}
        />
      )}

      <DuplicateWarning
        duplicateEmailErrors={previewData.duplicateEmailErrors || []}
        duplicateNameErrors={previewData.duplicateNameErrors || []}
      />

      <div className="flex flex-col 2xl:flex-row overflow-y-auto gap-4">
        <CompaniesList />
        <ContactsList />
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0 pt-4 border-t">
        <Button variant="outline" onClick={() => navigate({ to: '/$tenantId/import/map', params: { tenantId } })}>
          Back
        </Button>
        <Button onClick={() => handleImport()} disabled={!canImport} className="flex-1">
          Import Selected ({selectedCompanies + selectedContacts} items)
        </Button>
      </div>
    </div>
  );
}
