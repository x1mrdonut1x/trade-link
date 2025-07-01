import { Button } from '@tradelink/ui/components/button';
import { Input } from '@tradelink/ui/components/input';
import { ArrowLeft, Search } from 'lucide-react';
import React from 'react';
import { Link } from '@tanstack/react-router';

interface HeaderAction {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary';
  onClick?: () => void;
}

interface FilterOption {
  value: string;
  label: string;
}

interface PageHeaderProps {
  title: string;
  actions?: HeaderAction[];
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showBackButton?: boolean;
  backTo?: string;
  backLabel?: string;
  filters?: {
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    placeholder?: string;
  }[];
}

export function PageHeader({
  title,
  actions = [],
  showSearch = false,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  showBackButton = false,
  backTo = '/',
  backLabel = 'Back',
  filters = [],
}: PageHeaderProps) {
  return (
    <>
      {/* Back Button */}
      {showBackButton && (
        <div className="mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to={backTo}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backLabel}
            </Link>
          </Button>
        </div>
      )}

      {/* Title and Actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight mb-3">{title}</h1>
        {actions.length > 0 && (
          <div className="flex gap-2">
            {actions.map((action, index) => (
              <Button key={index} variant={action.variant || 'default'} onClick={action.onClick}>
                {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
      {/* Search and Filters */}
      {(showSearch || filters.length > 0) && (
        <div className="flex gap-4 mb-6">
          {showSearch && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={e => onSearchChange?.(e.target.value)}
                className="pl-10 h-full"
              />
            </div>
          )}
          {filters.map((filter, index) => (
            <select
              key={index}
              value={filter.value}
              onChange={e => filter.onChange(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md"
            >
              {filter.placeholder && <option value="all">{filter.placeholder}</option>}
              {filter.options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}
    </>
  );
}
