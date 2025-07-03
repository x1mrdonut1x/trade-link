import { createFileRoute, Link } from '@tanstack/react-router';
import { Button } from '@tradelink/ui/components/button';
import { ArrowLeft, Building2, CalendarPlus, Edit, MessageSquare } from '@tradelink/ui/icons';
import { useGetCompany } from 'api/company/hooks';
import { PageHeader } from 'components/page-header/PageHeader';
import { useBreadcrumbSetup } from 'context/breadcrumb-context';
import { CompanyInfoCard } from './-components/CompanyInfoCard';
import { QuickActionsCard } from './-components/QuickActionsCard';
import { SalesAgentsCard } from './-components/SalesAgentsCard';

export const Route = createFileRoute('/_app/companies/$companyId/')({
  component: CompanyDetail,
});

function CompanyDetail() {
  const { companyId } = Route.useParams();

  const { data: company, isLoading } = useGetCompany(companyId);

  useBreadcrumbSetup(
    [
      { title: 'Companies', href: '/companies', isActive: false },
      {
        title: company?.name || '',
        href: `/companies/${companyId}`,
        isActive: true,
        isLoading: isLoading && !company,
      },
    ],
    isLoading && !company
  );

  if (isLoading) {
    return <div className="text-center py-8">Loading company...</div>;
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Company not found</h3>
        <p className="text-muted-foreground mb-4">The company you're looking for doesn't exist.</p>
        <Button asChild>
          <Link to="/companies">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Companies
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={company.name}
        backTo="/companies"
        actions={[
          {
            label: 'Schedule Event',
            icon: CalendarPlus,
            variant: 'outline',
          },
          {
            label: 'Send Message',
            icon: MessageSquare,
            variant: 'outline',
          },
          {
            label: 'Edit Company',
            icon: Edit,
            link: { to: '/companies/$companyId/edit', params: { companyId } },
            variant: 'default',
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Company Overview */}
        <div className="lg:col-span-2 space-y-6">
          <CompanyInfoCard company={company} />
          <SalesAgentsCard contacts={company.contact} companyId={companyId} />
          {/* <AdditionalDetailsCard customFields={company.customFields} />
          <RecentEventsCard events={company.recentEvents} /> */}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* <QuickStatsCard agentsCount={company.agentsCount} eventsCount={company.eventsCount} lastContact={company.lastContact} /> */}
          <QuickActionsCard />
        </div>
      </div>
    </>
  );
}
