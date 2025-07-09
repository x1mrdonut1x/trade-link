import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@tradelink/ui/components/button';
import { AlertTriangle, FileText, Users } from '@tradelink/ui/icons';
import { CompanyIcon } from 'components/icons/CompanyIcon';
import { useImportContext } from 'context';

export const Route = createFileRoute('/_app/$tenantId/import/_4/success')({
  component: SubmitStepPage,
});

export function SubmitStepPage() {
  const { tenantId } = Route.useParams();
  const importContext = useImportContext();

  const { importStats } = importContext;

  if (!importStats) return;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{importStats.totalRecords}</div>
          <div className="text-sm text-muted-foreground">Total Records</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <CompanyIcon className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{importStats.companies}</div>
          <div className="text-sm text-muted-foreground">Companies</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{importStats.contacts}</div>
          <div className="text-sm text-muted-foreground">Contacts</div>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{importStats.errors}</div>
          <div className="text-sm text-muted-foreground">Errors</div>
        </div>
      </div>

      {importStats.errors > 0 && (
        <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-sm">Some records had errors</p>
            <p className="text-sm text-muted-foreground">
              {importStats.errors} records were skipped due to validation errors or conflicts.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="font-medium">What's next?</h4>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>• Your data has been successfully imported into the system</p>
          <p>• You can view and manage your companies and contacts from their respective pages</p>
          <p>• Consider reviewing the imported data to ensure accuracy</p>
        </div>
      </div>

      <div className="flex gap-3 mt-auto pt-4 border-t">
        <Button asChild>
          <Link to="/$tenantId/companies" params={{ tenantId }}>
            View Companies
          </Link>
        </Button>
        <Button asChild>
          <Link to="/$tenantId/contacts" params={{ tenantId }}>
            View Contacts
          </Link>
        </Button>
      </div>
    </>
  );
}
