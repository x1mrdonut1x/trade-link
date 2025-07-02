import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { CompanyForm } from 'components/company/CompanyForm';
import { PageHeader } from 'components/page-header/PageHeader';
import { useBreadcrumbSetup } from 'context/breadcrumb-context';
import { ArrowLeft } from 'lucide-react';

export const Route = createFileRoute('/_app/companies/add/')({
  component: AddCompany,
});

function AddCompany() {
  const router = useRouter();

  // Set up breadcrumbs
  useBreadcrumbSetup([
    { title: 'Companies', href: '/companies', isActive: false },
    { title: 'Add Company', href: '/companies/add', isActive: true },
  ]);

  const handleSuccess = (companyId: number) => {
    router.navigate({ to: '/companies/$companyId', params: { companyId: companyId.toString() } });
  };

  const handleCancel = () => {
    router.history.back();
  };

  return (
    <>
      <PageHeader
        title="Add New Company"
        actions={[
          {
            label: 'Back to Companies',
            icon: ArrowLeft,
            variant: 'outline',
            link: { to: '/companies' },
          },
        ]}
      />

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <CompanyForm onSuccess={handleSuccess} onCancel={handleCancel} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
