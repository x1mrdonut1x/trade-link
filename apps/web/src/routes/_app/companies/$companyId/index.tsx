import { Button } from '@tradelink/ui/components/button';
import { PageHeader } from 'components/page-header/PageHeader';
import { createFileRoute, Link } from '@tanstack/react-router';
import { 
  ArrowLeft, 
  Building2, 
  Edit, 
  UserPlus,
  CalendarPlus,
  MessageSquare
} from 'lucide-react';
import { CompanyInfoCard } from './-components/CompanyInfoCard';
import { AdditionalDetailsCard } from './-components/AdditionalDetailsCard';
import { SalesAgentsCard } from './-components/SalesAgentsCard';
import { RecentEventsCard } from './-components/RecentEventsCard';
import { QuickStatsCard } from './-components/QuickStatsCard';
import { QuickActionsCard } from './-components/QuickActionsCard';
import { mockCompanies } from './-components/mockData';

export const Route = createFileRoute('/_app/companies/$companyId/')({
  component: CompanyDetail,
});

function CompanyDetail() {
  const params = Route.useParams();
  const companyId = params.companyId;
  const company = mockCompanies.find(c => c.id === parseInt(companyId));

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
        showBackButton={true}
        backTo="/companies"
        actions={[
          {
            label: "Add Agent",
            icon: UserPlus,
            variant: "outline"
          },
          {
            label: "Schedule Event",
            icon: CalendarPlus,
            variant: "outline"
          },
          {
            label: "Send Message",
            icon: MessageSquare,
            variant: "outline"
          },
          {
            label: "Edit Company",
            icon: Edit,
            variant: "default"
          }
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Company Overview */}
        <div className="lg:col-span-2 space-y-6">
          <CompanyInfoCard company={company} />
          <AdditionalDetailsCard customFields={company.customFields} />
          <SalesAgentsCard agents={company.agents} />
          <RecentEventsCard events={company.recentEvents} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <QuickStatsCard 
            agentsCount={company.agentsCount}
            eventsCount={company.eventsCount}
            lastContact={company.lastContact}
          />
          <QuickActionsCard />
        </div>
      </div>
    </>
  );
}
