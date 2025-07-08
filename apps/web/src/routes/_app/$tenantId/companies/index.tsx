import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { getAllCompaniesQuerySchema, type GetAllCompaniesResponse } from '@tradelink/shared/company';
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
import { useDeleteCompany, useGetAllCompanies } from 'api/company';
import { TagFilter } from 'components/filters';
import { PageHeader } from 'components/page-header/PageHeader';
import { TagBadge } from 'components/tags';
import { useBreadcrumbSetup } from 'context/breadcrumb-context';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/_app/$tenantId/companies/')({
  validateSearch: zodValidator(getAllCompaniesQuerySchema),
  component: Companies,
});

function Companies() {
  const { tenantId } = Route.useParams();
  const { search, page, size, sortBy, sortOrder, tagIds } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [searchQuery, setSearchQuery] = useState(search);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(tagIds || []);

  useBreadcrumbSetup([{ title: 'Companies', href: '/companies', isActive: true }]);

  useEffect(() => {
    if (searchQuery === search) return;

    const timer = setTimeout(() => {
      navigate({
        search: {
          search: searchQuery,
          page,
          size,
          sortBy,
          sortOrder,
          tagIds: selectedTagIds.length > 0 ? selectedTagIds.join(',') : undefined,
        },
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, navigate, search, page, size, sortBy, sortOrder, selectedTagIds]);

  const { data: companies, isLoading } = useGetAllCompanies({
    search,
    page,
    size,
    sortBy,
    sortOrder,
    tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
  });
  const deleteCompany = useDeleteCompany();

  const handleRowClick = (company: GetAllCompaniesResponse[0]) => {
    navigate({ to: '/$tenantId/companies/$companyId', params: { companyId: company.id.toString() } });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this company?')) {
      try {
        await deleteCompany.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete company:', error);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    navigate({
      search: {
        search: searchQuery,
        page: newPage,
        size,
        sortBy,
        sortOrder,
        tagIds: selectedTagIds.length > 0 ? selectedTagIds.join(',') : undefined,
      },
    });
  };

  const handleTagSelect = (tagId: number) => {
    setSelectedTagIds(prev => [...prev, tagId]);
  };

  const handleTagDeselect = (tagId: number) => {
    setSelectedTagIds(prev => prev.filter(id => id !== tagId));
  };

  const handleSort = (field: string) => {
    const newSortOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    navigate({
      search: {
        search: searchQuery,
        page,
        size,
        sortBy: field as any,
        sortOrder: newSortOrder,
        tagIds: selectedTagIds.length > 0 ? selectedTagIds.join(',') : undefined,
      },
    });
  };

  const columns: Column<GetAllCompaniesResponse[0]>[] = [
    {
      title: 'Company',
      sortable: true,
      sortOrder: sortBy === 'name' ? sortOrder : undefined,
      onSort: () => handleSort('name'),
      render: company => (
        <>
          <div className="font-medium">{company.name}</div>
          {company.description && (
            <div className="text-sm text-muted-foreground truncate max-w-xs">{company.description}</div>
          )}
        </>
      ),
    },
    {
      title: 'Email',
      sortable: true,
      sortOrder: sortBy === 'email' ? sortOrder : undefined,
      onSort: () => handleSort('email'),
      render: company =>
        company.email ? (
          <a href={`mailto:${company.email}`} className={`text-blue-600 hover:underline`}>
            {company.email}
          </a>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      title: 'Phone',
      sortable: true,
      sortOrder: sortBy === 'phoneNumber' ? sortOrder : undefined,
      onSort: () => handleSort('phoneNumber'),
      render: company => {
        return company?.phoneNumber ? (
          <a href={`tel:${company?.phonePrefix}${company?.phoneNumber}`} className={`text-blue-600 hover:underline`}>
            {company?.phonePrefix} {company?.phoneNumber}
          </a>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      title: 'Location',
      sortable: true,
      sortOrder: sortBy === 'city' ? sortOrder : undefined,
      onSort: () => handleSort('city'),
      render: company => {
        return company?.city || company?.country ? (
          <div className="text-sm">
            {company?.city ? `${company?.city}, ` : ``}
            {company?.country}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      title: 'Contacts',
      sortable: true,
      sortOrder: sortBy === 'contacts' ? sortOrder : undefined,
      onSort: () => handleSort('contacts'),
      render: company => (
        <Badge variant="secondary">
          {company.contacts} {company.contacts === 1 ? 'contact' : 'contacts'}
        </Badge>
      ),
    },
    {
      title: 'Website',
      sortable: true,
      sortOrder: sortBy === 'website' ? sortOrder : undefined,
      onSort: () => handleSort('website'),
      render: company =>
        company.website ? (
          <a
            href={company.website.startsWith('http') ? company.website : 'https://${company.website}'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
            onClick={e => e.stopPropagation()}
          >
            {company.website}
          </a>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      title: 'Tags',
      render: company => (
        <div className="flex gap-1 flex-wrap">
          {company.tags && company.tags.length > 0 ? (
            company.tags.map(tag => <TagBadge key={tag.id} tag={tag} />)
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      align: 'right',
      render: company => (
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
                to="/$tenantId/companies/$companyId/edit"
                params={{ tenantId, companyId: company.id.toString() }}
              >
                Edit Company
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={e => {
                e.stopPropagation();
                handleDelete(company.id);
              }}
              className="text-destructive"
              disabled={deleteCompany.isPending}
            >
              Delete Company
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Companies"
        showSearch
        searchPlaceholder="Search companies..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        actions={[
          {
            label: 'Add Company',
            icon: PlusCircle,
            link: { to: '/$tenantId/companies/add', params: { tenantId } },
          },
        ]}
      />

      <div className="mb-4">
        <TagFilter selectedTagIds={selectedTagIds} onTagSelect={handleTagSelect} onTagDeselect={handleTagDeselect} />
      </div>

      <Card>
        <CardContent>
          <DataTable
            data={companies || []}
            columns={columns}
            loading={isLoading}
            skeletonRows={5}
            onRowClick={handleRowClick}
            emptyMessage={search ? 'No companies found' : 'No companies yet'}
            emptyDescription={
              search ? `No companies match your search for "${search}".` : `Get started by adding your first company.`
            }
            emptyAction={
              search ? (
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              ) : undefined
            }
          />

          {!isLoading && companies && companies.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <Pagination
                currentPage={page || 1}
                pageSize={size || 30}
                itemCount={companies.length}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
