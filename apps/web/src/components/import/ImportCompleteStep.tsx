import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { AlertTriangle, Building2, CheckCircle, Download, FileText, Loader2, Users } from '@tradelink/ui/icons';

interface ImportStats {
  totalRecords: number;
  companies: number;
  contacts: number;
  errors: number;
}

interface ImportCompleteStepProps {
  isImporting: boolean;
  importComplete: boolean;
  importStats: ImportStats | null;
  error: string | null;
  onStartOver: () => void;
  onDownloadErrorReport?: () => void;
}

export function ImportCompleteStep({
  isImporting,
  importComplete,
  importStats,
  error,
  onStartOver,
  onDownloadErrorReport,
}: ImportCompleteStepProps) {
  if (isImporting) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-500" />
            <h3 className="text-xl font-medium mb-2">Importing your data...</h3>
            <p className="text-muted-foreground">This may take a few moments depending on the amount of data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="py-12">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">Import Failed</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={onStartOver}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (importComplete && importStats) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Import Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{importStats.totalRecords}</div>
              <div className="text-sm text-muted-foreground">Total Records</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Building2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
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
              {onDownloadErrorReport && (
                <Button size="sm" variant="outline" onClick={onDownloadErrorReport}>
                  <Download className="h-4 w-4 mr-1" />
                  Error Report
                </Button>
              )}
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
            <Button onClick={onStartOver} variant="outline">
              Import More Data
            </Button>
            <Button onClick={() => (globalThis.location.href = '/companies')}>View Companies</Button>
            <Button onClick={() => (globalThis.location.href = '/contacts')}>View Contacts</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
