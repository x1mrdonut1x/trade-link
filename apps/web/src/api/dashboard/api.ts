import { myFetch } from '../client';

import type { GetDashboardStatsResponse } from '@tradelink/shared';

export const dashboardApi = (tenantId: string) => ({
  getStats: () => {
    return myFetch<GetDashboardStatsResponse>(tenantId, 'dashboard/stats');
  },
});
