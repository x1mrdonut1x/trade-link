import { createFileRoute, Outlet, redirect, useMatchRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { PageHeader } from 'components/page-header/PageHeader';
import { Stepper } from 'components/stepper/Stepper';
import { useBreadcrumbSetup } from 'context/breadcrumb-context';
import { ImportProvider, type ImportStep } from 'context/import-context';

export const Route = createFileRoute('/_app/$tenantId/import')({
  component: ImportDataPage,
  beforeLoad: ({ location }) => {
    if (location.pathname.endsWith('/import') || location.pathname.endsWith('/import/')) {
      console.log('redirecting to first import step');
      throw redirect({ to: importSteps[0].url });
    }
  },
});

const importSteps: ImportStep[] = [
  {
    index: 0,
    url: '/$tenantId/import/upload',
    title: 'Upload File',
    description: 'Select your CSV file',
  },
  {
    index: 1,
    url: '/$tenantId/import/map',
    title: 'Map Fields',
    description: 'Match your columns to our fields',
  },
  {
    index: 2,
    url: '/$tenantId/import/review',
    title: 'Review Data',
    description: 'Preview and validate your data',
  },
  {
    index: 3,
    url: '/$tenantId/import/success',
    title: 'Submit',
    header: 'Submit data',
    description: 'Submit your data into the system',
  },
];

function ImportDataPage() {
  const matchRoute = useMatchRoute();

  useBreadcrumbSetup([{ title: 'Import Data', href: '/import', isActive: true }]);

  const currentStepData = importSteps.find(step => matchRoute({ to: step.url }) != null) || importSteps[0];
  const currentStepIndex = currentStepData.index;

  return (
    <ImportProvider>
      <PageHeader title="Import Data" />

      <div className="h-full flex flex-col space-y-6">
        {/* Progress Stepper */}
        <Stepper steps={importSteps} currentStep={currentStepIndex} />

        <div className="flex-1 overflow-hidden">
          <Card className="flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center gap-2">
                {currentStepData.header || currentStepData.title}
                {currentStepData.description && (
                  <p className="text-sm text-muted-foreground">{currentStepData.description}</p>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-6">
              <Outlet />
            </CardContent>
          </Card>
        </div>
      </div>
    </ImportProvider>
  );
}
