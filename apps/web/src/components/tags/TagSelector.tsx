import type { TagDto } from '@tradelink/shared';
import { Badge } from '@tradelink/ui/components/badge';
import { Button } from '@tradelink/ui/components/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@tradelink/ui/components/command';
import { Popover, PopoverContent, PopoverTrigger } from '@tradelink/ui/components/popover';
import { Check, ChevronDown, Plus } from '@tradelink/ui/icons';
import { cn } from '@tradelink/ui/lib/utils';
import { useState } from 'react';

interface TagSelectorProps {
  availableTags: TagDto[];
  selectedTags: TagDto[];
  onTagSelect: (tag: TagDto) => void;
  onTagDeselect: (tag: TagDto) => void;
  onCreateTag?: () => void;
  disabled?: boolean;
}

export function TagSelector({
  availableTags,
  selectedTags,
  onTagSelect,
  onTagDeselect,
  onCreateTag,
  disabled = false,
}: TagSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedTagIds = new Set(selectedTags.map(tag => tag.id));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between" disabled={disabled}>
          <span className="flex items-center gap-1">
            {selectedTags.length > 0 ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''} selected
                </span>
              </>
            ) : (
              'Select tags...'
            )}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search tags..." />
          <CommandEmpty>
            {onCreateTag ? (
              <div className="p-2">
                <Button variant="ghost" size="sm" onClick={onCreateTag} className="w-full justify-start">
                  <Plus className="mr-2 h-4 w-4" />
                  Create new tag
                </Button>
              </div>
            ) : (
              'No tags found.'
            )}
          </CommandEmpty>
          <CommandGroup>
            {availableTags.map(tag => {
              const isSelected = selectedTagIds.has(tag.id);
              return (
                <CommandItem
                  key={tag.id}
                  value={tag.name}
                  onSelect={() => {
                    if (isSelected) {
                      onTagDeselect(tag);
                    } else {
                      onTagSelect(tag);
                    }
                  }}
                  className="cursor-pointer"
                >
                  <Check className={cn('mr-2 h-4 w-4', isSelected ? 'opacity-100' : 'opacity-0')} />
                  <Badge
                    variant="secondary"
                    className="text-white border-none mr-2"
                    style={{ backgroundColor: tag.color }}
                  >
                    {tag.name}
                  </Badge>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
