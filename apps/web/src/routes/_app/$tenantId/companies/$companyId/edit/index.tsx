import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent } from '@tradelink/ui/components/card';
import { ArrowLeft, Link } from '@tradelink/ui/icons';
import { useGetCompany } from 'api/company';
import { CompanyForm } from 'components/company/CompanyForm';
import { CompanyIcon } from 'components/icons/CompanyIcon';
import { PageHeader } from 'components/page-header/PageHeader';
import { useBreadcrumbSetup } from 'context/breadcrumb-context';

export const Route = createFileRoute('/_app/$tenantId/companies/$companyId/edit/')({
  component: EditCompany,
});

function EditCompany() {
  const { tenantId, companyId } = Route.useParams();
  const router = useRouter();

  const { data: company, isLoading } = useGetCompany(companyId);

  // Set up breadcrumbs
  useBreadcrumbSetup(
    [
      { title: 'Companies', href: '/companies', isActive: false },
      {
        title: company?.name || '',
        href: `/companies/${companyId}`,
        isActive: false,
        isLoading: isLoading && !company,
      },
      { title: 'Edit', href: '/companies/${companyId}/edit', isActive: true },
    ],
    isLoading && !company
  );

  const handleSuccess = (companyId: number) => {
    router.navigate({ to: '/$tenantId/companies/$companyId', params: { tenantId, companyId: companyId.toString() } }); // Will navigate to company detail once route is available
  };

  const handleCancel = () => {
    router.history.back();
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading company...</div>;
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <CompanyIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Company not found</h3>
        <p className="text-muted-foreground mb-4">The company you"re looking for doesn"t exist.</p>
        <Button>
          <Link to="/$tenantId/companies">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Companies
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader title={`Edit ${company.name}`} backTo={`/companies/${companyId}`} />

      <div className="max-w-2xl sm:mx-auto">
        <Card>
          <CardContent className="pt-6">
            <CompanyForm company={company} onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
