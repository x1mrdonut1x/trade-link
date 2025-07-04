import { createFileRoute, Outlet, redirect, useLocation } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { CheckCircle } from '@tradelink/ui/icons';
import { PageHeader } from 'components/page-header/PageHeader';
import { ImportProvider, type ImportStep } from 'context/import-context';

export const Route = createFileRoute('/_app/import')({
  component: ImportDataPage,
  beforeLoad: ({ location }) => {
    if (location.pathname === '/import' || location.pathname === '/import/') {
      throw redirect({ to: importSteps[0].url });
    }
  },
});

const importSteps: ImportStep[] = [
  {
    index: 0,
    url: '/import/upload',
    title: 'Upload File',
    description: 'Select your CSV file',
  },
  {
    index: 1,
    url: '/import/map',
    title: 'Map Fields',
    description: 'Match your columns to our fields',
  },
  {
    index: 2,
    url: '/import/review',
    title: 'Review Data',
    description: 'Preview and validate your data',
  },
  {
    index: 3,
    url: '/import/success',
    title: 'Submit',
    header: (
      <>
        <CheckCircle className="h-6 w-6 text-green-500" />
        Import Complete!
      </>
    ),
    description: 'Submit your data into the system',
  },
];

function ImportDataPage() {
  const location = useLocation();

  const currentStepData = importSteps.find(step => step.url === location.pathname) || importSteps[0];
  const currentStepIndex = currentStepData.index;

  return (
    <ImportProvider>
      <PageHeader title="Import Data" />

      <div className="h-full flex flex-col space-y-6">
        {/* Progress bar */}
        <div className="bg-card border rounded-lg p-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Import Progress</h3>
            <span className="text-sm text-muted-foreground">Step {currentStepIndex + 1} of 4</span>
          </div>
          <div className="flex items-center gap-4">
            {importSteps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isActive = index === currentStepIndex;

              return (
                <div key={step.index} className="flex items-center">
                  <div className="flex flex-col items-center min-w-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {isCompleted ? '✓' : step.index + 1}
                    </div>
                    <span
                      className={`text-xs mt-1 font-medium text-center whitespace-nowrap ${
                        index >= currentStepIndex ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < importSteps.length - 1 && (
                    <div className={`w-12 h-0.5 mx-3 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

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
