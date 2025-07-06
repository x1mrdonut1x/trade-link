import { Link } from '@tanstack/react-router';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { Calendar, CheckSquare, ExternalLink } from '@tradelink/ui/icons';
import { useGetAllTodos } from 'api/todos';

export const UpcomingTodos = () => {
  const { data: todos = [], isLoading } = useGetAllTodos({ status: 'upcoming' });

  const formatDate = (date: string | Date) => {
    const todoDate = new Date(date);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (todoDate < today) {
      return 'Overdue';
    } else if (todoDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (todoDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return todoDate.toLocaleDateString();
    }
  };

  const getDateColor = (date: string | Date) => {
    const todoDate = new Date(date);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (todoDate < today) {
      return 'text-red-600';
    } else if (todoDate.getTime() === today.getTime()) {
      return 'text-orange-600';
    } else {
      return 'text-muted-foreground';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming TODOs</CardTitle>
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
        ) : todos.length === 0 ? (
          <div className="text-center py-6">
            <CheckSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No upcoming TODOs</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {todos.slice(0, 5).map(todo => (
                <div key={todo.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{todo.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span className={`text-xs ${getDateColor(todo.reminderDate)}`}>
                        {formatDate(todo.reminderDate)}
                      </span>
                      {todo.contact && (
                        <span className="text-xs text-muted-foreground">
                          • {todo.contact.firstName} {todo.contact.lastName}
                        </span>
                      )}
                      {todo.company && <span className="text-xs text-muted-foreground">• {todo.company.name}</span>}
                    </div>
                  </div>
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button asChild className="w-full" variant="outline">
                <Link to="/todos">
                  View All TODOs
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
