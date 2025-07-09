import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Calendar, PlusCircle, Users } from '@tradelink/ui/icons';
import { TokenDebugPanel } from 'components/debug/TokenDebugPanel';
import { PageHeader } from 'components/page-header/PageHeader';
import { dashboardApi } from '../../../api/dashboard/api';

import { CompanyIcon } from 'components/icons/CompanyIcon';
import { TaskIcon } from 'components/icons/TaskIcon';
import { TasksCard } from 'components/tasks';
import { useTenantParam } from 'hooks/use-tenant-param';
import { StatCard } from '../-components/StatCard';
import { UpcomingEvents } from '../-components/UpcomingEvents';
import { UpcomingTasks } from '../-components/UpcomingTasks';

export const Route = createFileRoute('/_app/$tenantId/')({
  component: Dashboard,
});

function Dashboard() {
  const tenantId = useTenantParam();

  // Fetch real dashboard data
  const {
    data: dashboardStats,
    isLoading: isLoadingStats,
    error: statsError,
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi(tenantId).getStats,
  });

  const isLoading = isLoadingStats;
  const error = statsError;

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Hotel Sales Management Dashboard"
          actions={[{ label: 'Add Company', variant: 'default', icon: PlusCircle }]}
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Companies" value={0} subtitle="Loading..." icon={CompanyIcon} />
          <StatCard title="Total Contacts" value={0} subtitle="Loading..." icon={Users} />
          <StatCard title="Total Events" value={0} subtitle="Loading..." icon={Calendar} />
          <StatCard title="Pending Tasks" value={0} subtitle="Loading..." icon={TaskIcon} />
        </div>
      </>
    );
  }

  // Show error state if data fetch failed
  if (error) {
    return (
      <>
        <PageHeader
          title="Hotel Sales Management Dashboard"
          actions={[{ label: 'Add Company', variant: 'default', icon: PlusCircle }]}
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Companies" value={0} subtitle="Error loading data" icon={CompanyIcon} />
          <StatCard title="Total Contacts" value={0} subtitle="Error loading data" icon={Users} />
          <StatCard title="Total Events" value={0} subtitle="Error loading data" icon={Calendar} />
          <StatCard title="Pending Tasks" value={0} subtitle="Error loading data" icon={TaskIcon} />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Hotel Sales Management Dashboard"
        actions={[{ label: 'Add Company', variant: 'default', icon: PlusCircle }]}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Companies"
          value={dashboardStats?.totalCompanies ?? 0}
          subtitle={`+${dashboardStats?.recentCompanies ?? 0} in last 7 days`}
          icon={CompanyIcon}
        />
        <StatCard
          title="Total Contacts"
          value={dashboardStats?.totalContacts ?? 0}
          subtitle={`+${dashboardStats?.recentContacts ?? 0} in last 7 days`}
          icon={Users}
        />
        <StatCard
          title="Total Events"
          value={dashboardStats?.totalEvents ?? 0}
          subtitle={`+${dashboardStats?.recentEvents ?? 0} in last 7 days`}
          icon={Calendar}
        />
        <StatCard title="Pending Tasks" value={0} subtitle="Loading..." icon={TaskIcon} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <UpcomingTasks />
        <UpcomingEvents />
        <TasksCard title="Quick Tasks" />
      </div>

      {/* Debug panel for development */}
      {import.meta.env.DEV && (
        <div className="mt-6">
          <TokenDebugPanel />
        </div>
      )}
    </>
  );
}
