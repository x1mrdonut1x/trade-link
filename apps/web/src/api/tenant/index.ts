import { queryOptions } from '@tanstack/react-query';
import type {
  CreateTenantRequest,
  CreateTenantResponse,
  DeleteTenantResponse,
  GetTenantResponse,
  GetUserTenantsResponse,
  UpdateTenantRequest,
  UpdateTenantResponse,
} from '@tradelink/shared';
import { myFetch } from '../client';

export function tenantApi() {
  return {
    // Get all tenants for the current user
    getUserTenants: (): Promise<GetUserTenantsResponse> => myFetch(undefined, 'tenants'),

    // Get a specific tenant
    getTenant: (tenantId: number): Promise<GetTenantResponse> => myFetch(undefined, `tenants/${tenantId}`),

    // Create a new tenant
    createTenant: (data: CreateTenantRequest): Promise<CreateTenantResponse> =>
      myFetch(undefined, 'tenants', {
        method: 'POST',
        body: data,
      }),

    // Update a tenant
    updateTenant: (tenantId: number, data: UpdateTenantRequest): Promise<UpdateTenantResponse> =>
      myFetch(undefined, `tenants/${tenantId}`, {
        method: 'PUT',
        body: data,
      }),

    // Delete a tenant
    deleteTenant: (tenantId: number): Promise<DeleteTenantResponse> =>
      myFetch(undefined, `tenants/${tenantId}`, {
        method: 'DELETE',
      }),
  };
}

export function userTenantsQueryOptions() {
  return queryOptions({
    queryKey: ['user-tenants'],
    queryFn: tenantApi().getUserTenants,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function tenantQueryOptions(tenantId: number) {
  return queryOptions({
    queryKey: ['tenant', tenantId],
    queryFn: () => tenantApi().getTenant(tenantId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
