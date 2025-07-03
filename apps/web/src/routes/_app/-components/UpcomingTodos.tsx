import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { CheckSquare } from '@tradelink/ui/icons';

interface Todo {
  id: number;
  title: string;
  type: string;
  dueDate: string;
}

interface UpcomingTodosProps {
  todos: Todo[];
}

export const UpcomingTodos = ({ todos }: UpcomingTodosProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming To-Do's & Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {todos.map(todo => (
            <div key={todo.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-medium">{todo.title}</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {todo.type} • Due: {todo.dueDate}
                </p>
              </div>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button className="w-full" variant="outline">
            View All Tasks
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
