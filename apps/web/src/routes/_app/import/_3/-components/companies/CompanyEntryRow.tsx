import type { CompanyImportData, ImportEntry } from '@tradelink/shared';
import { Badge } from '@tradelink/ui/components/badge';
import { Button } from '@tradelink/ui/components/button';
import { Checkbox } from '@tradelink/ui/components/checkbox';
import { Edit3 } from '@tradelink/ui/icons';
import { useState } from 'react';
import { EditCompanyForm } from './EditCompanyForm';

interface CompanyEntryRowProps {
  entry: ImportEntry<CompanyImportData>;
  index: number;
  onToggle: () => void;
  onDataChange: <K extends keyof CompanyImportData>(field: K, value: CompanyImportData[K]) => void;
}

export function CompanyEntryRow({ entry, index, onToggle, onDataChange }: CompanyEntryRowProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = (...args: Parameters<typeof onDataChange>) => {
    onDataChange(...args);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <EditCompanyForm
        entry={entry}
        index={index}
        onToggle={onToggle}
        onDataChange={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
      <div className="flex items-center gap-2 min-w-0">
        <Badge variant="secondary" className="text-gray-500">
          #{index + 1}
        </Badge>
        <Checkbox checked={entry.selected} onCheckedChange={onToggle} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{entry.data.name}</span>
          <Badge variant={entry.action === 'create' ? 'default' : 'secondary'}>
            {entry.action === 'create' ? 'New' : 'Update'}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStartEdit}
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
