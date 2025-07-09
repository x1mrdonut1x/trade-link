export interface GetDashboardStatsResponse {
  totalCompanies: number;
  recentCompanies: number;
  totalContacts: number;
  recentContacts: number;
  totalEvents: number;
  recentEvents: number;
}

export interface UpcomingEvent {
  id: number;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  location: string;
  status: string;
}

export interface GetUpcomingEventsResponse {
  events: UpcomingEvent[];
}
