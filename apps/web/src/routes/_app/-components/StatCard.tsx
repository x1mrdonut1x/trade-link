import { Card, CardContent, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import type React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ElementType;
  loading?: boolean;
}

export const StatCard = ({ title, value, subtitle, icon: Icon, loading }: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{loading ? 'Loading...' : value}</div>
        <p className="text-xs text-muted-foreground">{loading ? 'Loading...' : subtitle}</p>
      </CardContent>
    </Card>
  );
};
