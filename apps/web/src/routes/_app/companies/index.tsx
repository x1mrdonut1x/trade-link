import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { getAllCompaniesQuerySchema } from '@tradelink/shared/company';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent } from '@tradelink/ui/components/card';
import { Building2, Filter, PlusCircle } from '@tradelink/ui/icons';
import { useGetAllCompanies } from 'api/company';
import { PageHeader } from 'components/page-header/PageHeader';
import { useBreadcrumbSetup } from 'context/breadcrumb-context';
import { useEffect, useState } from 'react';
import { CompanyCard } from './-components/CompanyCard';

export const Route = createFileRoute('/_app/companies/')({
  validateSearch: zodValidator(getAllCompaniesQuerySchema),
  component: Companies,
});

function Companies() {
  const { search, page, size } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [searchQuery, setSearchQuery] = useState(search || '');

  useBreadcrumbSetup([{ title: 'Companies', href: '/companies', isActive: true }]);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate({ search: { search: searchQuery, page, size } });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, navigate]);

  const { data: companies, isLoading } = useGetAllCompanies({ search, page, size });

  return (
    <>
      <PageHeader
        title="Companies"
        actions={[
          {
            label: 'Filter',
            icon: Filter,
            variant: 'outline',
          },
          {
            label: 'Add Company',
            icon: PlusCircle,
            variant: 'default',
            link: { to: '/companies/add' },
          },
        ]}
        showSearch={true}
        searchPlaceholder="Search companies..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {isLoading ? (
        <div className="text-center py-8">Loading companies...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies?.map(company => (
            <CompanyCard
              key={company.id}
              company={{
                ...company,
                contactsCount: company.contacts || 0,
              }}
            />
          ))}
        </div>
      )}

      {companies?.length === 0 && !isLoading && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{search ? 'No companies found' : 'No companies yet'}</h3>
            <p className="text-muted-foreground mb-4">
              {search ? `No companies match your search for "${search}".` : 'Get started by adding your first company.'}
            </p>
            {search ? (
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            ) : (
              <Button asChild>
                <Link to="/companies/add">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Company
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
