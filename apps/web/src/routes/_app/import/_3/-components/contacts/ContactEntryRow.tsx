import type { ContactImportData, ImportEntry } from '@tradelink/shared';
import { Badge } from '@tradelink/ui/components/badge';
import { Button } from '@tradelink/ui/components/button';
import { Checkbox } from '@tradelink/ui/components/checkbox';
import { Edit3 } from '@tradelink/ui/icons';

import { useState } from 'react';
import { EditContactForm } from './EditContactForm';

interface ContactEntryRowProps {
  entry: ImportEntry<ContactImportData>;
  index: number;
  onToggle: () => void;
  onCompanyChange: (companyId: number | null) => void;
  onDataChange: <K extends keyof ContactImportData>(field: K, value: ContactImportData[K]) => void;
}

export function ContactEntryRow({ entry, index, onToggle, onCompanyChange, onDataChange }: ContactEntryRowProps) {
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

  const getCompanyDisplay = () => {
    if (entry.matchedCompany) {
      return (
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-blue-600">@ {entry.matchedCompany.name}</span>
        </div>
      );
    }
    return <span className="text-sm text-muted-foreground italic">@ No company</span>;
  };

  if (isEditing) {
    return (
      <EditContactForm
        entry={entry}
        index={index}
        onToggle={onToggle}
        onCompanyChange={onCompanyChange}
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
        <div className="flex items-center gap-2 flex-wrap">
          {/* Contact name section */}
          <span className="font-medium">
            {entry.data.firstName} {entry.data.lastName}
          </span>

          {/* Company section - inline */}
          {getCompanyDisplay()}

          {/* Badges */}
          <Badge variant={entry.action === 'create' ? 'default' : 'secondary'}>
            {entry.action === 'create' ? 'New' : 'Update'}
          </Badge>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleStartEdit}
            className="h-6 w-6 p-0"
            title="Edit contact details"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
        </div>

        {/* Contact details - below name */}
        <div className="text-sm text-muted-foreground mt-1">
          <div>{entry.data.email}</div>
          {entry.data.jobTitle && <div>{entry.data.jobTitle}</div>}
          {entry.data.phoneNumber && <div>{entry.data.phoneNumber}</div>}
        </div>
      </div>
    </div>
  );
}
