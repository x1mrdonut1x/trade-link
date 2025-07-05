import { Link } from '@tanstack/react-router';
import type { DuplicateEmailError } from '@tradelink/shared';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { AlertTriangle, X } from '@tradelink/ui/icons';
import { useImportContext } from 'context';

export function DuplicateEmailWarning({ duplicateEmailErrors }: { duplicateEmailErrors: DuplicateEmailError[] }) {
  const { removeDuplicateEmailEntries } = useImportContext();

  if (!duplicateEmailErrors.length) return null;

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="h-5 w-5" />
          Duplicate Email Addresses Found
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <p className="text-sm text-orange-700">
            The following email addresses{' '}
            {duplicateEmailErrors.some(e => e.existingEntity) ? 'already exist in your database or ' : ''}appear
            multiple times in your data:
          </p>
          <div className="space-y-1 bg-white p-3 rounded border">
            {duplicateEmailErrors.map((error, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex-1">
                  <span className="font-medium">{error.email}</span>{' '}
                  {error.existingEntity ? (
                    <span className="ml-2">
                      <span className="text-red-600">already exists in database:</span>{' '}
                      <Link
                        to={error.type === 'company' ? '/companies/$companyId' : '/contacts/$contactId'}
                        params={{
                          companyId: error.existingEntity.id.toString(),
                          contactId: error.existingEntity.id.toString(),
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        {error.existingEntity.name} (ID: {error.existingEntity.id})
                      </Link>
                      <span className="text-muted-foreground"> ({error.type})</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground"> - Rows: {error.rows.join(', ')}</span>
                  )}
                </div>
                {error.rows.length > 0 && (
                  <div className="flex gap-1 ml-2">
                    {error.rows.map(row => (
                      <Button
                        key={row}
                        variant="outline"
                        size="sm"
                        onClick={() => removeDuplicateEmailEntries(error.email, error.type, [row])}
                        className="h-6 px-2 text-xs"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Unselect row {row}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-orange-700 font-medium">
            {duplicateEmailErrors.some(e => e.existingEntity)
              ? 'Please review these duplicates. You may need to update existing records or remove them from your import.'
              : 'Please fix these duplicates in your CSV file before importing or use the remove buttons to exclude specific rows from the import.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
