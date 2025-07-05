import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Building2, Calendar, CheckSquare, PlusCircle, Users } from '@tradelink/ui/icons';
import { PageHeader } from 'components/page-header/PageHeader';
import { dashboardApi } from '../../api/dashboard';

import { StatCard } from './-components/StatCard';
import { UpcomingEvents } from './-components/UpcomingEvents';
import { UpcomingTodos } from './-components/UpcomingTodos';

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

  // Mock data for components that don't have real endpoints yet
  const upcomingTodos = [
    { id: 1, title: 'Follow up with Grand Hotels Corp', type: 'company', dueDate: '2025-06-27' },
    { id: 2, title: 'Meeting with Agent Sarah Johnson', type: 'contact', dueDate: '2025-06-28' },
    { id: 3, title: 'Prepare for Hotel Trade Show 2025', type: 'event', dueDate: '2025-06-29' },
  ];

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
          <StatCard title="Pending Tasks" value={12} subtitle="5 due today" icon={CheckSquare} />
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
          <StatCard title="Pending Tasks" value={12} subtitle="5 due today" icon={CheckSquare} />
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
        <StatCard title="Pending Tasks" value={upcomingTodos.length} subtitle="5 due today" icon={CheckSquare} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <UpcomingTodos todos={upcomingTodos} />
        <UpcomingEvents events={upcomingEvents} />
      </div>
    </>
  );
}

export const Route = createFileRoute('/_app/')({
  component: Dashboard,
});
