import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Card, CardContent } from '@tradelink/ui/components/card';
import { CompanyForm } from 'components/company/CompanyForm';
import { PageHeader } from 'components/page-header/PageHeader';
import { useBreadcrumbSetup } from 'context/breadcrumb-context';

export const Route = createFileRoute('/_app/$tenantId/companies/add/')({
  component: AddCompany,
});

function AddCompany() {
  const router = useRouter();
  const { tenantId } = Route.useParams();

  useBreadcrumbSetup([
    { title: 'Companies', href: '/companies', isActive: false },
    { title: 'Add Company', href: '/companies/add', isActive: true },
  ]);

  const handleSuccess = (companyId: number) => {
    router.navigate({ to: '/$tenantId/companies/$companyId', params: { tenantId, companyId: companyId.toString() } });
  };

  const handleCancel = () => {
    router.history.back();
  };

  return (
    <>
      <PageHeader title="Add New Company" backTo="/companies" />

      <div className="max-w-2xl sm:mx-auto">
        <Card>
          <CardContent className="pt-6">
            <CompanyForm onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
