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
  const [searchTerm, setSearchTerm] = useState<string>();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: contacts = [], isLoading } = useGetAllContacts({ search: debouncedSearchTerm });

  const filteredContacts = useMemo(() => {
    let filtered = contacts;

    // Exclude contacts from a specific company
    if (excludeCompanyId) {
      filtered = filtered.filter(contact => contact.companyId !== excludeCompanyId);
    }

    return filtered;
  }, [contacts, excludeCompanyId]);

  const contactOptions: ComboboxOption[] = useMemo(
    () =>
      filteredContacts.map(contact => ({
        value: contact.id.toString(),
        label: `${contact.firstName} ${contact.lastName}${contact.email ? ` (${contact.email})` : ''}${contact.company ? ` - ${contact.company.name}` : ''}`,
      })),
    [filteredContacts]
  );

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
