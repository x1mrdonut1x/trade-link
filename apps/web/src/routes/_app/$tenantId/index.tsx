import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { PlusCircle } from '@tradelink/ui/icons';
import { PageHeader } from 'components/page-header/PageHeader';
import { dashboardApi } from '../../../api/dashboard/api';

import { CompanyIcon } from 'components/icons/CompanyIcon';
import { ContactIcon } from 'components/icons/ContactIcon';
import { EventIcon } from 'components/icons/EventIcon';
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

  const { data: dashboardStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi(tenantId).getStats,
  });

  const isLoading = isLoadingStats;

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
          loading={isLoading}
        />
        <StatCard
          title="Total Contacts"
          value={dashboardStats?.totalContacts ?? 0}
          subtitle={`+${dashboardStats?.recentContacts ?? 0} in last 7 days`}
          icon={ContactIcon}
          loading={isLoading}
        />
        <StatCard
          title="Total Events"
          value={dashboardStats?.totalEvents ?? 0}
          subtitle={`+${dashboardStats?.recentEvents ?? 0} in last 7 days`}
          icon={EventIcon}
          loading={isLoading}
        />
        <StatCard title="Pending Tasks" value={0} subtitle="Loading..." icon={TaskIcon} loading={isLoading} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <UpcomingTasks />
        <UpcomingEvents />
        <TasksCard title="Quick Tasks" />
      </div>
    </>
  );
}
