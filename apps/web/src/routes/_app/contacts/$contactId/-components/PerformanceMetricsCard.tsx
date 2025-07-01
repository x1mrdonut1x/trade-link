import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { TrendingUp } from 'lucide-react';
import type { ContactMetrics } from './types';

interface PerformanceMetricsCardProps {
  metrics: ContactMetrics;
}

export function PerformanceMetricsCard({ metrics }: PerformanceMetricsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Total Sales</span>
          <span className="font-semibold text-green-600">{metrics.totalSales}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Events Attended</span>
          <span className="font-semibold">{metrics.eventsAttended}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Conversion Rate</span>
          <span className="font-semibold text-blue-600">{metrics.conversionRate}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Avg Response Time</span>
          <span className="font-semibold">{metrics.responseTime}</span>
        </div>
      </CardContent>
    </Card>
  );
}
