import type { TagDto } from '@tradelink/shared';
import { Badge } from '@tradelink/ui/components/badge';
import { X } from '@tradelink/ui/icons';
import { cn } from '@tradelink/ui/lib/utils';

interface TagBadgeProps {
  tag: TagDto;
  onRemove?: () => void;
  className?: string;
}

export function TagBadge({ tag, onRemove, className }: TagBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn('text-white border-none', className)}
      style={{ backgroundColor: tag.color }}
    >
      {tag.name}
      {onRemove && (
        <button
          onClick={e => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors cursor-pointer"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
}
