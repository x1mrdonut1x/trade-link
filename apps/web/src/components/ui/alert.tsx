import { Button } from '@tradelink/ui/components/button';
import { AlertTriangle } from '@tradelink/ui/icons';
import { cn } from '@tradelink/ui/lib/utils';

interface AlertActionButton {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

interface AlertProps {
  variant?: 'warning' | 'error' | 'info';
  title: string;
  description: string;
  className?: string;
  action?: AlertActionButton;
}

export function Alert({ variant = 'warning', title, description, className, action }: AlertProps) {
  const variantStyles = {
    warning: 'bg-yellow-50 border-yellow-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const iconStyles = {
    warning: 'text-yellow-500',
    error: 'text-red-500',
    info: 'text-blue-500',
  };

  return (
    <div
      className={cn('flex items-center gap-2 p-3 border rounded-lg flex-shrink-0', variantStyles[variant], className)}
    >
      <AlertTriangle className={cn('h-5 w-5 flex-shrink-0', iconStyles[variant])} />
      <div className="flex-1">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action && (
        <Button variant={action.variant || 'outline'} size="sm" onClick={action.onClick} className="ml-2 flex-shrink-0">
          {action.label}
        </Button>
      )}
    </div>
  );
}
