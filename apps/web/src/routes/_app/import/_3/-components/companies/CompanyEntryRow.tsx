import type { CompanyImportData, ImportEntry } from '@tradelink/shared';
import { Badge } from '@tradelink/ui/components/badge';
import { Button } from '@tradelink/ui/components/button';
import { Checkbox } from '@tradelink/ui/components/checkbox';
import { Edit3 } from '@tradelink/ui/icons';
import { useState } from 'react';
import { EditCompanyForm } from './EditCompanyForm';

interface CompanyEntryRowProps {
  entry: ImportEntry<CompanyImportData>;
  onToggle: () => void;
  onDataChange: (field: keyof CompanyImportData, value: string) => void;
}

export function CompanyEntryRow({ entry, onToggle, onDataChange }: CompanyEntryRowProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <EditCompanyForm
        entry={entry}
        onToggle={onToggle}
        onDataChange={(...args) => {
          onDataChange(...args);
          setIsEditing(false);
        }}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
      <Checkbox checked={entry.selected} onCheckedChange={onToggle} />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{entry.data.name}</span>
          <Badge variant={entry.action === 'create' ? 'default' : 'secondary'}>
            {entry.action === 'create' ? 'New' : 'Update'}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsEditing(true);
            }}
            className="h-6 w-6 p-0"
            title="Edit company details"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
        </div>
        {/* Company details - below name */}
        <div className="text-sm text-muted-foreground mt-1">
          {entry.data.email && <div>{entry.data.email}</div>}
          {entry.data.website && <div>{entry.data.website}</div>}
          {entry.data.city && entry.data.country && (
            <div>
              {entry.data.city}, {entry.data.country}
            </div>
          )}
          {entry.data.phoneNumber && <div>{entry.data.phoneNumber}</div>}
        </div>
      </div>
    </div>
  );
}
