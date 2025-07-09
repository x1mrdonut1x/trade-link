import type { GetEventResponse, TagDto } from '@tradelink/shared';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { Plus } from '@tradelink/ui/icons';
import { useAssignEventTags, useUnassignEventTags } from 'api/events/hooks';
import { useGetAllTags } from 'api/tags';
import { TagBadge, TagSelector } from 'components/tags';
import { useState } from 'react';

interface EventTagsCardProps {
  event: GetEventResponse;
  title?: string;
}

export function EventTagsCard({ event, title = 'Tags' }: EventTagsCardProps) {
  const [showSelector, setShowSelector] = useState(false);

  const { data: allTags = [] } = useGetAllTags();
  const assignEventTags = useAssignEventTags();
  const unassignEventTags = useUnassignEventTags();

  const eventTags = event.tags || [];

  const handleTagSelect = async (tag: TagDto) => {
    await assignEventTags.mutateAsync({
      id: event.id,
      tagIds: [tag.id],
    });
    setShowSelector(false);
  };

  const handleTagRemove = async (tag: TagDto) => {
    await unassignEventTags.mutateAsync({
      id: event.id,
      tagIds: [tag.id],
    });
  };

  // Filter out already assigned tags
  const availableTags = allTags.filter(tag => !eventTags.some(assignedTag => assignedTag.id === tag.id));

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
            {eventTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {eventTags.map(tag => (
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
