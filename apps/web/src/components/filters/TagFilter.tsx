import { Button } from '@tradelink/ui/components/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@tradelink/ui/components/command';
import { Popover, PopoverContent, PopoverTrigger } from '@tradelink/ui/components/popover';
import { Check, ChevronDown, Filter } from '@tradelink/ui/icons';
import { cn } from '@tradelink/ui/lib/utils';
import { useGetAllTags } from 'api/tags';
import { TagBadge } from 'components/tags';
import { useState } from 'react';

interface TagFilterProps {
  selectedTagIds: number[];
  onTagSelect: (tagId: number) => void;
  onTagDeselect: (tagId: number) => void;
  onClearAll: () => void;
  disabled?: boolean;
}

export function TagFilter({
  selectedTagIds,
  onTagSelect,
  onTagDeselect,
  onClearAll,
  disabled = false,
}: TagFilterProps) {
  const [open, setOpen] = useState(false);
  const { data: allTags = [] } = useGetAllTags();

  const selectedTags = allTags.filter(tag => selectedTagIds.includes(tag.id));
  const selectedTagIdsSet = new Set(selectedTagIds);

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
            disabled={disabled}
          >
            <Filter className="mr-2 h-4 w-4" />
            <span className="flex items-center gap-1">
              {selectedTagIds.length > 0 ? (
                <>
                  <span className="text-sm">
                    {selectedTagIds.length} tag{selectedTagIds.length > 1 ? 's' : ''}
                  </span>
                </>
              ) : (
                'Filter by tags'
              )}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandEmpty>No tags found.</CommandEmpty>
            <CommandGroup>
              {allTags.map(tag => {
                const isSelected = selectedTagIdsSet.has(tag.id);
                return (
                  <CommandItem
                    key={tag.id}
                    value={tag.name}
                    onSelect={() => {
                      if (isSelected) {
                        onTagDeselect(tag.id);
                      } else {
                        onTagSelect(tag.id);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <Check className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
                    <TagBadge tag={tag} />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedTagIds.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedTags.slice(0, 3).map(tag => (
            <TagBadge key={tag.id} tag={tag} onRemove={() => onTagDeselect(tag.id)} className="text-xs" />
          ))}
          {selectedTags.length > 3 && (
            <span className="text-xs text-muted-foreground">+{selectedTags.length - 3} more</span>
          )}
        </div>
      )}
    </div>
  );
}
