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
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: companies = [], isLoading } = useGetAllCompanies({ search: debouncedSearchTerm });

  const companyOptions: ComboboxOption[] = useMemo(
    () =>
      companies.map(company => {
        const labelParts = [company.name];

        if (company.city) {
          labelParts.push(` - ${company.city}`);
        }

        if (company.country) {
          labelParts.push(`, ${company.country}`);
        }

        return {
          value: company.id.toString(),
          label: labelParts.join(''),
        };
      }),
    [companies]
  );
  console.log(' companyOptions:', companyOptions);

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
