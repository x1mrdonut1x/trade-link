import type { ContactWithCompanyDto } from '@tradelink/shared';
import { Combobox, type ComboboxOption } from '@tradelink/ui/components/combobox';
import { useEffect, useMemo, useState } from 'react';
import { useGetAllContacts } from '../../api/contact/hooks';

export interface ContactSelectorProps {
  value?: string;
  onValueChange?: (contactId: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  excludeCompanyId?: number;
}

export function ContactSelector({
  value,
  onValueChange,
  placeholder = 'Select contact...',
  searchPlaceholder = 'Search contacts...',
  emptyText = 'No contacts found.',
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
  excludeCompanyId,
}: ContactSelectorProps) {
  // State for search input with debouncing
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  console.log(' debouncedSearchTerm:', debouncedSearchTerm);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch all contacts from API with search
  const { data: contacts = [], isLoading } = useGetAllContacts(debouncedSearchTerm);

  // Filter contacts based on props
  const filteredContacts = useMemo(() => {
    let filtered = contacts;

    // Exclude contacts from a specific company
    if (excludeCompanyId) {
      filtered = filtered.filter(contact => contact.companyId !== excludeCompanyId);
    }

    return filtered;
  }, [contacts, excludeCompanyId]);

  // Convert contacts to combobox options
  const contactOptions: ComboboxOption[] = useMemo(() => {
    return filteredContacts.map((contact: ContactWithCompanyDto) => ({
      value: contact.id.toString(),
      label: `${contact.firstName} ${contact.lastName}${contact.email ? ` (${contact.email})` : ''}${contact.company ? ` - ${contact.company.name}` : ''}`,
    }));
  }, [filteredContacts]);

  const handleChange = (selectedValue: string) => {
    setSearchTerm('');
    onValueChange?.(selectedValue);
  };

  return (
    <Combobox
      options={contactOptions}
      value={value}
      onValueChange={handleChange}
      placeholder={isLoading ? 'Loading contacts...' : placeholder}
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
