import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { AlertTriangle, Building2, Calendar, Users } from '@tradelink/ui/icons';

interface ImportStats {
  totalRecords: number;
  companies: number;
  contacts: number;
  events: number;
  errors: number;
}

interface ImportStatsDisplayProps {
  stats: ImportStats;
}

export const ImportStatsDisplay = ({ stats }: ImportStatsDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalRecords}</div>
              <p className="text-sm text-muted-foreground">Total Records</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
              <p className="text-sm text-muted-foreground">Errors</p>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Companies</span>
              </div>
              <span className="font-semibold">{stats.companies}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Sales Agents</span>
              </div>
              <span className="font-semibold">{stats.contacts}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Events</span>
              </div>
              <span className="font-semibold">{stats.events}</span>
            </div>

            {stats.errors > 0 && (
              <div className="flex items-center justify-between text-red-600">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">Errors</span>
                </div>
                <span className="font-semibold">{stats.errors}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
