import { Link } from '@tanstack/react-router';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { Calendar, ExternalLink } from '@tradelink/ui/icons';
import { useGetAllTasks } from 'api/tasks';
import { Empty } from 'components/empty/Empty';
import { TaskIcon } from 'components/icons/TaskIcon';
import { useTenantParam } from 'hooks/use-tenant-param';

export const UpcomingTasks = () => {
  const tenantId = useTenantParam();

  const { data: tasks = [], isLoading } = useGetAllTasks({ status: 'upcoming' });

  const formatDate = (date?: string | Date | null) => {
    if (!date) return;

    const taskDate = new Date(date);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (taskDate < today) {
      return 'Overdue';
    } else if (taskDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (taskDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return taskDate.toLocaleDateString();
    }
  };

  const getDateColor = (date?: string | Date | null) => {
    if (!date) return 'text-muted-foreground';
    const taskDate = new Date(date);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (taskDate < today) {
      return 'text-red-600';
    } else if (taskDate.getTime() === today.getTime()) {
      return 'text-orange-600';
    } else {
      return 'text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <Empty
            size="sm"
            icon={TaskIcon}
            title="No Upcoming Tasks"
            description="You have no tasks scheduled for the next 7 days."
          />
        ) : (
          <>
            <div className="space-y-3">
              {tasks.slice(0, 5).map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span className={`text-xs ${getDateColor(task.reminderDate)}`}>
                        {formatDate(task.reminderDate)}
                      </span>
                      {task.contact && (
                        <Link
                          to="/$tenantId/contacts/$contactId"
                          params={{ tenantId, contactId: task.contact.id.toString() }}
                          className="text-xs text-muted-foreground"
                        >
                          • {task.contact.firstName} {task.contact.lastName}
                        </Link>
                      )}
                      {task.company && (
                        <Link
                          to="/$tenantId/companies/$companyId"
                          params={{ tenantId, companyId: task.company.id.toString() }}
                          className="text-xs text-muted-foreground"
                        >
                          • {task.company.name}
                        </Link>
                      )}
                    </div>
                  </div>
                  <TaskIcon className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button asChild className="w-full" variant="outline">
                <Link to="/$tenantId/tasks" params={{ tenantId }}>
                  View All Tasks
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
