import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { CheckCircle } from '@tradelink/ui/icons';
import type { ImportStep } from './types';

interface ImportStepsProps {
  steps: ImportStep[];
}

export function ImportSteps({ steps }: ImportStepsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Process</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map(step => (
            <div
              key={step.id}
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                step.active
                  ? 'bg-blue-50 border border-blue-200'
                  : step.completed
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  step.completed ? 'bg-green-500 text-white' : step.active ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step.completed ? <CheckCircle className="h-4 w-4" /> : step.id}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
