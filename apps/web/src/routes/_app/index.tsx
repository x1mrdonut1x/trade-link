import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Building2, Calendar, CheckSquare, PlusCircle, Users } from '@tradelink/ui/icons';
import { PageHeader } from 'components/page-header/PageHeader';
import { dashboardApi } from '../../api/dashboard';

import { TasksCard } from 'components/tasks';
import { StatCard } from './-components/StatCard';
import { UpcomingEvents } from './-components/UpcomingEvents';
import { UpcomingTasks } from './-components/UpcomingTasks';

function Dashboard() {
  // Fetch real dashboard data
  const {
    data: dashboardStats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
  });

  // Mock data for events (can be replaced with real API later)
  const upcomingEvents = [
    { id: 1, name: 'Hotel Trade Show 2025', date: '2025-07-15', location: 'Berlin' },
    { id: 2, name: 'Hospitality Sales Expo', date: '2025-08-22', location: 'Munich' },
  ];

  // Show loading state
  if (isLoading) {
    return (
      <>
        <PageHeader
          title="Hotel Sales Management Dashboard"
          actions={[{ label: 'Add Company', variant: 'default', icon: PlusCircle }]}
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Companies" value={0} subtitle="Loading..." icon={Building2} />
          <StatCard title="Total Contacts" value={0} subtitle="Loading..." icon={Users} />
          <StatCard title="Upcoming Events" value={3} subtitle="Next: July 15th" icon={Calendar} />
          <StatCard title="Pending Tasks" value={0} subtitle="Loading..." icon={CheckSquare} />
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
          <StatCard title="Companies" value={0} subtitle="Error loading data" icon={Building2} />
          <StatCard title="Total Contacts" value={0} subtitle="Error loading data" icon={Users} />
          <StatCard title="Upcoming Events" value={3} subtitle="Next: July 15th" icon={Calendar} />
          <StatCard title="Pending Tasks" value={0} subtitle="Error loading data" icon={CheckSquare} />
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
          icon={Building2}
        />
        <StatCard
          title="Total Contacts"
          value={dashboardStats?.totalContacts ?? 0}
          subtitle={`+${dashboardStats?.recentContacts ?? 0} in last 7 days`}
          icon={Users}
        />
        <StatCard title="Upcoming Events" value={upcomingEvents.length} subtitle="Next: July 15th" icon={Calendar} />
        <StatCard title="Pending Tasks" value={0} subtitle="Loading..." icon={CheckSquare} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <UpcomingTasks />
        <UpcomingEvents events={upcomingEvents} />
        <TasksCard title="Quick Tasks" />
      </div>
    </>
  );
}

export const Route = createFileRoute('/_app/')({
  component: Dashboard,
});
