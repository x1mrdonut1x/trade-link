import { createFileRoute, useNavigate } from '@tanstack/react-router';
import type { ImportExecuteResponse } from '@tradelink/shared';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { AlertTriangle, Building2, Loader2, Users } from '@tradelink/ui/icons';
import { importAPI } from 'api/import/import.service';
import { useImportContext } from 'context';
import { useState } from 'react';
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

  const { previewData } = importContext;

  const handleImport = async () => {
    if (!previewData) return;

    setIsLoading(true);
    setError(null);

    try {
      const selectedCompanies = previewData.companies.filter(entry => entry.selected);
      const selectedContacts = previewData.contacts.filter(entry => entry.selected);

      console.log('1');
      const executeResponse = await importAPI.executeImport({
        companies: selectedCompanies.map(entry => ({
          data: entry.data,
          action: entry.action,
          existingId: entry.existingId,
        })),
        contacts: selectedContacts.map(entry => ({
          data: entry.data,
          action: entry.action,
          existingId: entry.existingId,
          companyId: entry.companyId || entry.matchedCompany?.id,
        })),
      });
      console.log('2');

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
      <>
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Processing Error</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => navigate({ to: '/import/map' })} variant="outline">
            Go Back
          </Button>
        </div>
        {importErrorDetails?.length && (
          <div className="flex flex-col gap-2">
            {importErrorDetails.map(error => (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">
                    Row: {error.row}, Field: {error.field}
                  </p>
                  <p className="text-sm text-muted-foreground">{error.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </>
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
