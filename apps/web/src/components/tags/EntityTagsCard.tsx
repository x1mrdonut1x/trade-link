import type { TagDto } from '@tradelink/shared';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { Plus } from '@tradelink/ui/icons';
import {
  useAssignTagsToCompany,
  useAssignTagsToContact,
  useGetAllTags,
  useUnassignTagsFromCompany,
  useUnassignTagsFromContact,
} from 'api/tags';
import { TagBadge, TagSelector } from 'components/tags';
import { useState } from 'react';

interface EntityTagsCardProps {
  entityType: 'contact' | 'company';
  entityId: number;
  tags: TagDto[];
  title?: string;
}

export function EntityTagsCard({ entityType, entityId, tags, title = 'Tags' }: EntityTagsCardProps) {
  const [showSelector, setShowSelector] = useState(false);

  const { data: allTags = [] } = useGetAllTags();
  const assignTagsToContact = useAssignTagsToContact();
  const unassignTagsFromContact = useUnassignTagsFromContact();
  const assignTagsToCompany = useAssignTagsToCompany();
  const unassignTagsFromCompany = useUnassignTagsFromCompany();

  const handleTagSelect = async (tag: TagDto) => {
    if (entityType === 'contact') {
      await assignTagsToContact.mutateAsync({
        contactId: entityId,
        data: { tagIds: [tag.id] },
      });
    } else {
      await assignTagsToCompany.mutateAsync({
        companyId: entityId,
        data: { tagIds: [tag.id] },
      });
    }
    setShowSelector(false);
  };

  const handleTagRemove = async (tag: TagDto) => {
    if (entityType === 'contact') {
      await unassignTagsFromContact.mutateAsync({
        contactId: entityId,
        data: { tagIds: [tag.id] },
      });
    } else {
      await unassignTagsFromCompany.mutateAsync({
        companyId: entityId,
        data: { tagIds: [tag.id] },
      });
    }
  };

  // Filter out already assigned tags
  const availableTags = allTags.filter(tag => !tags.some(assignedTag => assignedTag.id === tag.id));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          {!showSelector && (
            <Button variant="outline" size="sm" onClick={() => setShowSelector(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tag
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showSelector ? (
          <div className="space-y-4">
            <TagSelector
              availableTags={availableTags}
              selectedTags={[]}
              onTagSelect={handleTagSelect}
              onTagDeselect={() => {}}
            />
            <Button variant="outline" size="sm" onClick={() => setShowSelector(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <TagBadge key={tag.id} tag={tag} onRemove={() => handleTagRemove(tag)} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No tags assigned. Click "Add Tag" to get started.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
