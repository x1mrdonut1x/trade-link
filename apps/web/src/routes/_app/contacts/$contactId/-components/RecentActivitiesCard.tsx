import { Badge } from '@tradelink/ui/components/badge';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { Activity, Calendar, Mail, Phone, Plus, Users } from 'lucide-react';

interface RecentActivitiesCardProps {
  activities: any[]; // TODO replace
}

export function RecentActivitiesCard({ activities }: RecentActivitiesCardProps) {
  const getActivityIcon = (type: any) => {
    switch (type) {
      case 'call':
        return Phone;
      case 'email':
        return Mail;
      case 'meeting':
        return Users;
      case 'event':
        return Calendar;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: any) => {
    switch (type) {
      case 'call':
        return 'bg-blue-100 text-blue-800';
      case 'email':
        return 'bg-green-100 text-green-800';
      case 'meeting':
        return 'bg-purple-100 text-purple-800';
      case 'event':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Activities ({activities.length})
        </CardTitle>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Add Activity
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map(activity => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                <div className={`p-1.5 rounded-full ${getActivityColor(activity.type)}`}>
                  <Icon className="h-3 w-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                  {activity.outcome && <p className="text-xs text-green-600 mt-1 font-medium">Outcome: {activity.outcome}</p>}
                </div>
                <Badge variant="outline" className="text-xs capitalize">
                  {activity.type}
                </Badge>
              </div>
            );
          })}
          {activities.length === 0 && <p className="text-muted-foreground text-center py-6">No recent activities recorded.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
