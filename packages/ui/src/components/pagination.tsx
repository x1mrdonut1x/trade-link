import { ChevronLeft, ChevronRight } from '../icons';
import { Button } from './button';

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  itemCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, pageSize, itemCount, onPageChange, className }: PaginationProps) {
  const hasPrevious = currentPage > 1;
  const hasNext = itemCount >= pageSize;

  const handlePrevious = () => {
    if (hasPrevious) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onPageChange(currentPage + 1);
    }
  };

  // Only show pagination if there are items to paginate
  if (itemCount === 0) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between ${className || ''}`}>
      <div className="text-sm text-muted-foreground">
        Showing {Math.min(pageSize, itemCount)} items on page {currentPage}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={!hasPrevious}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={!hasNext}
          className="flex items-center gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
