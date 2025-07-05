import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { getAllContactsQuerySchema, type ContactWithCompanyDto } from '@tradelink/shared/contact';
import { Badge } from '@tradelink/ui/components/badge';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent } from '@tradelink/ui/components/card';
import { DataTable, type Column } from '@tradelink/ui/components/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@tradelink/ui/components/dropdown-menu';
import { Pagination } from '@tradelink/ui/components/pagination';
import { Ellipsis, PlusCircle } from '@tradelink/ui/icons';
import { useDeleteContact, useGetAllContacts } from 'api/contact/hooks';
import { PageHeader } from 'components/page-header/PageHeader';
import { useBreadcrumbSetup } from 'context/breadcrumb-context';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/_app/contacts/')({
  validateSearch: zodValidator(getAllContactsQuerySchema),
  component: Contacts,
});

export function Contacts() {
  const { search, page, size } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  useBreadcrumbSetup([{ title: 'Contacts', href: '/contacts', isActive: true }]);

  const [searchQuery, setSearchQuery] = useState(search);

  useEffect(() => {
    if (searchQuery === search) return;

    const timer = setTimeout(() => {
      navigate({ search: { search: searchQuery, page, size } });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, navigate, page, size, search]);

  const { data: contacts, isLoading } = useGetAllContacts({ search, page, size });
  const deleteContact = useDeleteContact();

  const handleRowClick = (contact: ContactWithCompanyDto) => {
    navigate({ to: '/contacts/$contactId', params: { contactId: contact.id.toString() } });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete contact:', error);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    navigate({ search: { search: searchQuery, page: newPage, size } });
  };

  const columns: Column<ContactWithCompanyDto>[] = [
    {
      title: 'Name',
      render: contact => (
        <>
          <div className="font-medium">
            {contact.firstName} {contact.lastName}
          </div>
          {contact.jobTitle && <div className="text-sm text-muted-foreground">{contact.jobTitle}</div>}
        </>
      ),
    },
    {
      title: 'Email',
      render: contact =>
        contact.email ? (
          <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
            {contact.email}
          </a>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      title: 'Company',
      render: contact =>
        contact.company?.name ? (
          <Link
            to="/companies/$companyId"
            params={{ companyId: contact.company.id.toString() }}
            onClick={e => e.stopPropagation()}
            className="hover:underline"
          >
            <Badge variant="secondary">{contact.company.name}</Badge>
          </Link>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      title: 'Phone',
      render: contact => {
        return contact?.phoneNumber ? (
          <a href={`tel:${contact?.phonePrefix}${contact?.phoneNumber}`} className="text-blue-600 hover:underline">
            {contact?.phonePrefix} {contact?.phoneNumber}
          </a>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      title: 'Location',
      render: contact => {
        return contact?.city || contact?.country ? (
          <div className="text-sm">
            {contact?.city ? `${contact?.city}, ` : ''}
            {contact?.country}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      title: 'Actions',
      align: 'right',
      render: contact => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                onClick={e => e.stopPropagation()}
                to="/contacts/$contactId/edit"
                params={{ contactId: contact.id.toString() }}
              >
                Edit Contact
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={e => {
                e.stopPropagation();
                handleDelete(contact.id);
              }}
              className="text-destructive"
              disabled={deleteContact.isPending}
            >
              Delete Contact
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Contacts"
        showSearch
        searchPlaceholder="Search by name, email, company, or job title..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        actions={[
          {
            label: 'Add New Contact',
            icon: PlusCircle,
            link: { to: '/contacts/add' },
          },
        ]}
      />

      <Card>
        <CardContent>
          <DataTable
            data={contacts || []}
            columns={columns}
            loading={isLoading}
            skeletonRows={5}
            onRowClick={handleRowClick}
            emptyMessage={search ? 'No contacts found' : 'No contacts yet'}
            emptyDescription={
              search ? `No contacts match your search for "${search}".` : 'Get started by adding your first contact.'
            }
            emptyAction={
              search ? (
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              ) : undefined
            }
          />

          {!isLoading && contacts && contacts.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <Pagination
                currentPage={page || 1}
                pageSize={size || 30}
                itemCount={contacts.length}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
