import { Star } from 'lucide-react';
import { cn } from '../lib/utils';

interface RatingProps {
  value: number;
  max?: number;
  disabled?: boolean;
  onChange?: (value: number) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Rating = ({ value, max = 5, disabled = true, onChange, className, size = 'md' }: RatingProps) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const handleClick = (rating: number) => {
    if (!disabled && onChange) {
      onChange(rating);
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= value;

        return (
          <Star
            key={index}
            className={cn(
              sizeClasses[size],
              'transition-colors',
              isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300',
              !disabled && 'cursor-pointer hover:text-yellow-400'
            )}
            onClick={() => handleClick(starValue)}
          />
        );
      })}
    </div>
  );
};
