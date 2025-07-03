'use client';

import { Combobox, type ComboboxOption } from '@tradelink/ui/components/combobox';
import { countries } from 'countries-list';
import { useMemo, useState } from 'react';

interface CountrySelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export function CountrySelector({
  value,
  onValueChange,
  placeholder = 'Select country...',
  searchPlaceholder = 'Search countries...',
  emptyText = 'No countries found.',
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
}: CountrySelectorProps) {
  const [search, setSearch] = useState('');

  const countryOptions = useMemo<ComboboxOption[]>(() => {
    const allCountries = Object.entries(countries).map(([, country]) => ({
      value: country.name,
      label: country.name,
    }));

    // Sort countries alphabetically
    allCountries.sort((a, b) => a.label.localeCompare(b.label));

    return allCountries;
  }, []);

  const filteredOptions = useMemo(() => {
    if (!search) return countryOptions;

    const searchLower = search.toLowerCase();
    return countryOptions.filter(country => country.label.toLowerCase().includes(searchLower));
  }, [countryOptions, search]);

  const handleChange = (selectedValue: string) => {
    setSearch('');
    onValueChange?.(selectedValue);
  };

  return (
    <Combobox
      options={filteredOptions}
      value={value}
      onValueChange={handleChange}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyText={emptyText}
      disabled={disabled}
      className={className}
      triggerClassName={triggerClassName}
      contentClassName={contentClassName}
      onSearchChange={setSearch}
    />
  );
}
