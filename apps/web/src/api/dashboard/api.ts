import { myFetch } from '../client';

import type { GetDashboardStatsResponse, GetUpcomingEventsResponse } from '@tradelink/shared';

export const dashboardApi = (tenantId: string) => ({
  getStats: () => {
    return myFetch<GetDashboardStatsResponse>(tenantId, 'dashboard/stats');
  },
  getUpcomingEvents: () => {
    return myFetch<GetUpcomingEventsResponse>(tenantId, 'dashboard/upcoming-events');
  },
});
