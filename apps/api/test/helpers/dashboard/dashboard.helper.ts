import { GetDashboardStatsResponse } from '@tradelink/shared';
import { authRequest } from '../request.helper';

export const getDashboardStats = async () => {
  return authRequest().get<GetDashboardStatsResponse>('/dashboard/stats');
};
