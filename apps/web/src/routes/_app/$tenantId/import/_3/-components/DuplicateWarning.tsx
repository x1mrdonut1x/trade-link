import { Link } from '@tanstack/react-router';
import type { DuplicateEmailError, DuplicateNameError } from '@tradelink/shared';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { AlertTriangle, X } from '@tradelink/ui/icons';
import { useImportContext } from 'context';

interface DuplicateWarningProps {
  duplicateEmailErrors?: DuplicateEmailError[];
  duplicateNameErrors?: DuplicateNameError[];
}

interface DuplicateRowProps {
  identifier: string;
  type: 'company' | 'contact';
  rows: number[];
  existingEntity?: { id: number; name: string };
  onRemove: (rows: number[]) => void;
  getEntityLink: () => { to: string; params: Record<string, string> };
}

function DuplicateRow({ identifier, type, rows, existingEntity, onRemove, getEntityLink }: DuplicateRowProps) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex-1">
        <span className="font-medium">{identifier}</span>{' '}
        {existingEntity ? (
          <span className="ml-2">
            <span className="text-red-600">already exists in database:</span>{' '}
            <Link {...getEntityLink()} className="text-blue-600 hover:underline">
              {existingEntity.name} (ID: {existingEntity.id})
            </Link>
            <span className="text-muted-foreground"> ({type})</span>
          </span>
        ) : (
          <span className="text-muted-foreground"> - Rows: {rows.join(', ')}</span>
        )}
      </div>
      {rows.length > 0 && (
        <div className="flex gap-1 ml-2">
          {rows.map(row => (
            <Button key={row} variant="outline" size="sm" onClick={() => onRemove([row])} className="h-6 px-2 text-xs">
              <X className="h-3 w-3 mr-1" />
              Unselect row {row}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

interface DuplicateCardProps {
  title: string;
  description: string;
  hasExistingEntities: boolean;
  children: React.ReactNode;
}

function DuplicateCard({ title, description, hasExistingEntities, children }: DuplicateCardProps) {
  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <p className="text-sm text-orange-700">
            {description} {hasExistingEntities ? 'already exist in your database or ' : ''}appear multiple times in your
            data:
          </p>
          <div className="space-y-1 bg-white p-3 rounded border">{children}</div>
          <p className="text-sm text-orange-700 font-medium">
            {hasExistingEntities
              ? 'Please review these duplicates. You may need to update existing records or remove them from your import.'
              : 'Please fix these duplicates in your CSV file before importing or use the remove buttons to exclude specific rows from the import.'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function DuplicateWarning({ duplicateEmailErrors = [], duplicateNameErrors = [] }: DuplicateWarningProps) {
  const { removeDuplicateEmailEntries, removeDuplicateNameEntries } = useImportContext();

  const hasEmailDuplicates = duplicateEmailErrors.length > 0;
  const hasNameDuplicates = duplicateNameErrors.length > 0;

  if (!hasEmailDuplicates && !hasNameDuplicates) return null;

  return (
    <div className="space-y-4">
      {hasEmailDuplicates && (
        <DuplicateCard
          title="Duplicate Email Addresses Found"
          description="The following email addresses"
          hasExistingEntities={duplicateEmailErrors.some(e => e.existingEntity)}
        >
          {duplicateEmailErrors.map((error, index) => (
            <DuplicateRow
              key={index}
              identifier={error.email}
              type={error.type}
              rows={error.rows}
              existingEntity={error.existingEntity}
              onRemove={rows => removeDuplicateEmailEntries(error.email, error.type, rows)}
              getEntityLink={() => ({
                to: error.type === 'company' ? '/companies/$companyId' : '/contacts/$contactId',
                params: {
                  companyId: error.existingEntity!.id.toString(),
                  contactId: error.existingEntity!.id.toString(),
                },
              })}
            />
          ))}
        </DuplicateCard>
      )}

      {hasNameDuplicates && (
        <DuplicateCard
          title="Duplicate Company Names Found"
          description="The following company names"
          hasExistingEntities={duplicateNameErrors.some(e => e.existingEntity)}
        >
          {duplicateNameErrors.map((error, index) => (
            <DuplicateRow
              key={index}
              identifier={error.name}
              type={error.type}
              rows={error.rows}
              existingEntity={error.existingEntity}
              onRemove={rows => removeDuplicateNameEntries(error.name, error.type, rows)}
              getEntityLink={() => ({
                to: '/$tenantId/companies/$companyId',
                params: {
                  companyId: error.existingEntity!.id.toString(),
                },
              })}
            />
          ))}
        </DuplicateCard>
      )}
    </div>
  );
}
