import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { Label } from '@tradelink/ui/components/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@tradelink/ui/components/select';
import { AlertTriangle } from '@tradelink/ui/icons';

import { COMPANY_FIELDS, CONTACT_FIELDS } from './types';

import type { CsvColumn, FieldMapping, ImportType } from './types';

interface FieldMappingStepProps {
  csvColumns: CsvColumn[];
  fieldMappings: FieldMapping[];
  importType: ImportType;
  onMappingChange: (mappings: FieldMapping[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function FieldMappingStep({ csvColumns, fieldMappings, importType, onMappingChange, onNext, onBack }: FieldMappingStepProps) {
  const availableFields =
    importType === 'companies' ? COMPANY_FIELDS : (importType === 'contacts' ? CONTACT_FIELDS : [...COMPANY_FIELDS, ...CONTACT_FIELDS]);

  const handleMappingChange = (csvColumn: string, targetField: string) => {
    const newMappings = fieldMappings.filter(m => m.csvColumn !== csvColumn);
    if (targetField && targetField !== 'none') {
      newMappings.push({ csvColumn, targetField });
    }
    onMappingChange(newMappings);
  };

  const getMappingForColumn = (csvColumn: string) => {
    return fieldMappings.find(m => m.csvColumn === csvColumn)?.targetField || '';
  };

  const getRequiredFieldsNotMapped = () => {
    const mappedFields = new Set(fieldMappings.map(m => m.targetField));
    return availableFields.filter(field => field.required && !mappedFields.has(field.key));
  };

  const requiredFieldsNotMapped = getRequiredFieldsNotMapped();
  const canProceed = requiredFieldsNotMapped.length === 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Map Your Columns</CardTitle>
        <p className="text-sm text-muted-foreground">Match your CSV columns to the corresponding fields in our system</p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4">
        {!canProceed && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Required fields missing</p>
              <p className="text-sm text-muted-foreground">
                Please map the following required fields: {requiredFieldsNotMapped.map(f => f.label).join(', ')}
              </p>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {csvColumns.map(column => (
            <div key={column.name} className="grid grid-cols-2 gap-4 items-start">
              <div>
                <Label className="font-medium">{column.name}</Label>
                <div className="text-xs text-muted-foreground mt-1">
                  Sample: {column.values.slice(0, 3).join(', ')}
                  {column.values.length > 3 && '...'}
                </div>
              </div>
              <div>
                <Select value={getMappingForColumn(column.name)} onValueChange={value => handleMappingChange(column.name, value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="-- Don't import --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- Don't import --</SelectItem>

                    {(importType === 'companies' || importType === 'mixed') && (
                      <SelectGroup>
                        <SelectLabel>Company Fields</SelectLabel>
                        {COMPANY_FIELDS.map(field => (
                          <SelectItem key={field.key} value={field.key}>
                            {field.label} {field.required && '*'}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}

                    {(importType === 'contacts' || importType === 'mixed') && (
                      <SelectGroup>
                        <SelectLabel>Contact Fields</SelectLabel>
                        {CONTACT_FIELDS.map(field => (
                          <SelectItem key={field.key} value={field.key}>
                            {field.label} {field.required && '*'}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4 flex-shrink-0 border-t">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} disabled={!canProceed} className="flex-1">
            Next: Preview Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
