export interface CustomField {
  name: string;
  value: string;
}

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  companyId: number;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  lastContact: string;
  eventsCount: number;
  tags: string[];
  customFields: CustomField[];
  recentActivities: Activity[];
  upcomingEvents: Event[];
  metrics: ContactMetrics;
}

export interface Activity {
  id: number;
  type: 'call' | 'email' | 'meeting' | 'event';
  description: string;
  date: string;
  outcome?: string;
}

export interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface ContactMetrics {
  totalSales: string;
  eventsAttended: number;
  conversionRate: string;
  responseTime: string;
}
