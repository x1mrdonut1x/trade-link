import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { FileText } from '@tradelink/ui/icons';

interface AdditionalDetailsCardProps {
  customFields: any[];
}

export function AdditionalDetailsCard({ customFields }: AdditionalDetailsCardProps) {
  if (customFields.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Additional Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {customFields.map((field, index) => (
            <div key={index} className="text-sm">
              <span className="font-medium text-muted-foreground">{field.name}:</span>
              <p className="mt-1">{field.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
