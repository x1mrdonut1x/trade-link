import { Button } from '@tradelink/ui/components/button';
import { Plus } from '@tradelink/ui/icons';
import { Empty } from 'components/empty/Empty';
import { ReactNode } from 'react';

interface GenericParticipantsCardProps<T> {
  title: string;
  icon: ReactNode;
  items: T[];
  onAddItem?: () => void;
  renderItem: (item: T) => ReactNode;
  emptyMessage: string;
  addButtonText?: string;
}

export function GenericParticipantsCard<T extends { id: number }>({
  title,
  icon,
  items,
  onAddItem,
  renderItem,
  emptyMessage,
  addButtonText = 'Add',
}: GenericParticipantsCardProps<T>) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          {icon}
          {title} ({items.length})
        </h3>
        {onAddItem && (
          <Button variant="outline" size="sm" onClick={onAddItem}>
            <Plus className="h-4 w-4 mr-1" />
            {addButtonText}
          </Button>
        )}
      </div>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border">
            {renderItem(item)}
          </div>
        ))}
        {items.length === 0 && <Empty description={emptyMessage} />}
      </div>
    </div>
  );
}
