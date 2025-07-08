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
import { TagFilter } from 'components/filters';
import { PageHeader } from 'components/page-header/PageHeader';
import { TagBadge } from 'components/tags';
import { useBreadcrumbSetup } from 'context/breadcrumb-context';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/_app/$tenantId/contacts/')({
  validateSearch: zodValidator(getAllContactsQuerySchema),
  component: Contacts,
});

export function Contacts() {
  const { tenantId } = Route.useParams();
  const { search, page, size, tagIds } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  useBreadcrumbSetup([{ title: 'Contacts', href: '/contacts', isActive: true }]);

  const [searchQuery, setSearchQuery] = useState(search);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(tagIds || []);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate({
        search: { search: searchQuery, page, size, tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined },
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedTagIds, navigate, searchQuery, page, size]);

  const { data: contacts, isLoading } = useGetAllContacts({
    search,
    page,
    size,
    tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
  });
  const deleteContact = useDeleteContact();

  const handleRowClick = (contact: ContactWithCompanyDto) => {
    navigate({ to: '/$tenantId/contacts/$contactId', params: { tenantId, contactId: contact.id.toString() } });
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
    navigate({
      search: {
        search: searchQuery,
        page: newPage,
        size,
        tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
      },
    });
  };

  const handleTagSelect = (tagId: number) => {
    setSelectedTagIds(prev => [...prev, tagId]);
  };

  const handleTagDeselect = (tagId: number) => {
    setSelectedTagIds(prev => prev.filter(id => id !== tagId));
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
            to="/$tenantId/companies/$companyId"
            params={{ tenantId, companyId: contact.company.id.toString() }}
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
            {contact?.city ? `${contact?.city}, ` : ``}
            {contact?.country}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      title: 'Tags',
      render: contact => (
        <div className="flex flex-wrap gap-1">
          {contact.tags && contact.tags.length > 0 ? (
            contact.tags.slice(0, 2).map(tag => <TagBadge key={tag.id} tag={tag} />)
          ) : (
            <span className="text-muted-foreground text-sm">-</span>
          )}
          {contact.tags && contact.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{contact.tags.length - 2}
            </Badge>
          )}
        </div>
      ),
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
                to="/$tenantId/contacts/$contactId/edit"
                params={{ tenantId, contactId: contact.id.toString() }}
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
            link: { to: '/$tenantId/contacts/add', params: { tenantId } },
          },
        ]}
      />

      <div className="mb-4">
        <TagFilter selectedTagIds={selectedTagIds} onTagSelect={handleTagSelect} onTagDeselect={handleTagDeselect} />
      </div>

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
              search ? `No contacts match your search for "${search}".` : `Get started by adding your first contact.`
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
