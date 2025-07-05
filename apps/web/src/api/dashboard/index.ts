import { myFetch } from '../client';

import type { GetDashboardStatsResponse } from '@tradelink/shared';

export const dashboardApi = {
  getStats: (): Promise<GetDashboardStatsResponse> => {
    return myFetch<GetDashboardStatsResponse>('dashboard/stats');
  },
};
