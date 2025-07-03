import type { CompanyDto } from '@tradelink/shared';
import { Combobox, type ComboboxOption } from '@tradelink/ui/components/combobox';
import { useEffect, useMemo, useState } from 'react';
import { useGetAllCompanies } from '../../api/company/hooks';

export interface CompanySelectorProps {
  value?: string;
  onValueChange?: (companyId: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  excludeContactId?: number;
}

export function CompanySelector({
  value,
  onValueChange,
  placeholder = 'Select company...',
  searchPlaceholder = 'Search companies...',
  emptyText = 'No companies found.',
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
}: CompanySelectorProps) {
  // State for search input with debouncing
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch all companies from API with search
  const { data: companies = [], isLoading } = useGetAllCompanies(debouncedSearchTerm);

  // Convert companies to combobox options
  const companyOptions: ComboboxOption[] = useMemo(() => {
    return companies.map((company: CompanyDto) => ({
      value: company.id.toString(),
      label: `${company.name}${company.city ? ` - ${company.city}` : ''}${company.country ? `, ${company.country}` : ''}`,
    }));
  }, [companies]);

  const handleChange = (selectedValue: string) => {
    setSearchTerm('');
    onValueChange?.(selectedValue);
  };

  return (
    <Combobox
      options={companyOptions}
      value={value}
      onValueChange={handleChange}
      placeholder={isLoading ? 'Loading companies...' : placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyText={isLoading ? 'Loading...' : emptyText}
      disabled={disabled || isLoading}
      className={className}
      triggerClassName={triggerClassName}
      contentClassName={contentClassName}
      onSearchChange={setSearchTerm}
    />
  );
}
