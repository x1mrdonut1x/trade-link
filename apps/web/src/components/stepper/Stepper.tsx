import { CheckCircle } from '@tradelink/ui/icons';
import { cn } from '@tradelink/ui/lib/utils';

export interface StepperStep {
  index: number;
  title: string;
  description?: string;
  header?: React.ReactNode;
}

interface StepperProps {
  steps: StepperStep[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn('bg-card border rounded-lg p-6 flex-shrink-0', className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Import Progress</h3>
        <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
          Step {currentStep + 1} of {steps.length}
        </span>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isFuture = index > currentStep;

          return (
            <div key={step.index} className="flex items-center flex-1">
              <div className="flex flex-col items-center min-w-0 flex-1">
                {/* Step Circle */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-sm',
                    {
                      'bg-green-500 text-white shadow-green-200': isCompleted,
                      'bg-blue-500 text-white shadow-blue-200 ring-4 ring-blue-100': isActive,
                      'bg-gray-100 text-gray-500 border-2 border-gray-200': isFuture,
                    }
                  )}
                >
                  {isCompleted ? <CheckCircle className="h-5 w-5" /> : <span>{step.index + 1}</span>}
                </div>

                {/* Step Label */}
                <div className="mt-3 text-center">
                  <span
                    className={cn('text-sm font-medium block transition-colors duration-200', {
                      'text-green-600': isCompleted,
                      'text-blue-600': isActive,
                      'text-gray-500': isFuture,
                    })}
                  >
                    {step.title}
                  </span>
                  {step.description && (
                    <span
                      className={cn('text-xs mt-1 block transition-colors duration-200', {
                        'text-green-500': isCompleted,
                        'text-blue-500': isActive,
                        'text-gray-400': isFuture,
                      })}
                    >
                      {step.description}
                    </span>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 px-4">
                  <div
                    className={cn('h-1 rounded-full transition-all duration-300', {
                      'bg-green-500': isCompleted,
                      'bg-gradient-to-r from-blue-500 to-gray-200': isActive,
                      'bg-gray-200': isFuture,
                    })}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden space-y-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isFuture = index > currentStep;

          return (
            <div key={step.index} className="relative">
              <div className="flex items-start space-x-4">
                {/* Step Circle */}
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-sm flex-shrink-0',
                    {
                      'bg-green-500 text-white shadow-green-200': isCompleted,
                      'bg-blue-500 text-white shadow-blue-200 ring-4 ring-blue-100': isActive,
                      'bg-gray-100 text-gray-500 border-2 border-gray-200': isFuture,
                    }
                  )}
                >
                  {isCompleted ? <CheckCircle className="h-6 w-6" /> : <span>{step.index + 1}</span>}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0 pb-4">
                  <span
                    className={cn('text-base font-medium block transition-colors duration-200', {
                      'text-green-600': isCompleted,
                      'text-blue-600': isActive,
                      'text-gray-500': isFuture,
                    })}
                  >
                    {step.title}
                  </span>
                  {step.description && (
                    <span
                      className={cn('text-sm mt-1 block transition-colors duration-200', {
                        'text-green-500': isCompleted,
                        'text-blue-500': isActive,
                        'text-gray-400': isFuture,
                      })}
                    >
                      {step.description}
                    </span>
                  )}
                </div>
              </div>

              {/* Vertical Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-6 transform -translate-x-1/2">
                  <div
                    className={cn('w-full h-full rounded-full transition-all duration-300', {
                      'bg-green-500': isCompleted,
                      'bg-gradient-to-b from-blue-500 to-gray-200': isActive,
                      'bg-gray-200': isFuture,
                    })}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
