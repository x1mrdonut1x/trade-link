import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { CheckCircle } from 'lucide-react';

interface ImportStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

interface ImportStepsProps {
  steps: ImportStep[];
}

export const ImportSteps = ({ steps }: ImportStepsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Process</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center space-x-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed
                    ? 'bg-green-500 text-white'
                    : step.active
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.completed ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${step.active ? 'text-blue-600' : ''}`}>
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
