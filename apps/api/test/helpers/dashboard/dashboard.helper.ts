import { authRequest } from '../request.helper';

export const getDashboardStats = async () => {
  return authRequest().get('/dashboard/stats');
};
