import { PageHeader } from '@/components/page-header/PageHeader';
import { createFileRoute } from '@tanstack/react-router';
import { Building2, Calendar, CheckSquare, PlusCircle, Users } from 'lucide-react';
import { StatCard } from './-components/StatCard';
import { UpcomingTodos } from './-components/UpcomingTodos';
import { UpcomingEvents } from './-components/UpcomingEvents';

function Dashboard() {
  // Mock data - would come from API
  const dashboardStats = {
    totalCompanies: 152,
    totalAgents: 347,
    upcomingEvents: 3,
    pendingTodos: 12,
    upcomingReminders: 5,
    thisMonthMeetings: 28,
  };

  const upcomingTodos = [
    { id: 1, title: 'Follow up with Grand Hotels Corp', type: 'company', dueDate: '2025-06-27' },
    { id: 2, title: 'Meeting with Agent Sarah Johnson', type: 'contact', dueDate: '2025-06-28' },
    { id: 3, title: 'Prepare for Hotel Trade Show 2025', type: 'event', dueDate: '2025-06-29' },
  ];

  const upcomingEvents = [
    { id: 1, name: 'Hotel Trade Show 2025', date: '2025-07-15', location: 'Berlin' },
    { id: 2, name: 'Hospitality Sales Expo', date: '2025-08-22', location: 'Munich' },
  ];

  return (
    <>
      <PageHeader
        title="Hotel Sales Management Dashboard"
        actions={[{ label: 'Add Company', variant: 'default', icon: PlusCircle }]}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Companies"
          value={dashboardStats.totalCompanies}
          subtitle="+12 this month"
          icon={Building2}
        />
        <StatCard
          title="Total Sales Agents"
          value={dashboardStats.totalAgents}
          subtitle="+23 this month"
          icon={Users}
        />
        <StatCard
          title="Upcoming Events"
          value={dashboardStats.upcomingEvents}
          subtitle="Next: July 15th"
          icon={Calendar}
        />
        <StatCard
          title="Pending Tasks"
          value={dashboardStats.pendingTodos}
          subtitle={`${dashboardStats.upcomingReminders} due today`}
          icon={CheckSquare}
        />
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
