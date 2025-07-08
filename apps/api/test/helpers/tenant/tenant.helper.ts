import {
  CreateTenantResponse,
  GetTenantResponse,
  type CreateTenantRequest,
  type DeleteTenantResponse,
  type GetUserTenantsResponse,
  type UpdateTenantRequest,
  type UpdateTenantResponse,
} from '@tradelink/shared';
import { authRequest } from '../request.helper';

export const tenantsHelper = {
  fixtures: {
    create: {
      name: 'Test Tenant',
    },
  },
  async create(data: CreateTenantRequest) {
    return authRequest().post<CreateTenantResponse>('/tenants', data);
  },

  async getUserTenants(query?: GetUserTenantsResponse) {
    return authRequest().get<GetUserTenantsResponse>('/tenants');
  },

  async getById(id: number) {
    return authRequest().get<GetTenantResponse>(`/tenants/${id}`);
  },

  async update(id: number, data: UpdateTenantRequest) {
    return authRequest().patch<UpdateTenantResponse>(`/tenants/${id}`, data);
  },

  async delete(id: number) {
    return authRequest().delete<DeleteTenantResponse>(`/tenants/${id}`);
  },
};
