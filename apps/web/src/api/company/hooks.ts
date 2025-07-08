import { useMutation, useQuery, useQueryClient, type MutationOptions } from '@tanstack/react-query';

import { companyApi } from './api';

import type {
  CreateCompanyRequest,
  CreateCompanyResponse,
  UpdateCompanyRequest,
  UpdateCompanyResponse,
} from '@tradelink/shared';
import type { GetAllCompaniesQuery } from '@tradelink/shared/company';
import type { ApiError } from 'api/client.util';
import { useTenantParam } from 'hooks/use-tenant-param';

const COMPANIES_QUERY_KEY = 'companies';

export function useGetAllCompanies(query: Partial<GetAllCompaniesQuery>) {
  const tenantId = useTenantParam();

  return useQuery({
    queryKey: [COMPANIES_QUERY_KEY, query],
    queryFn: () => companyApi(tenantId).getAll(query),
  });
}

export function useGetCompany(id: number | string) {
  const tenantId = useTenantParam();

  return useQuery({
    queryKey: [COMPANIES_QUERY_KEY, id],
    queryFn: () => companyApi(tenantId).getById(Number(id)),
    enabled: !!id,
  });
}

export function useCreateCompany(options?: MutationOptions<CreateCompanyResponse, ApiError, CreateCompanyRequest>) {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companyApi(tenantId).create,
    ...options,
    onSuccess: (...args) => {
      options?.onSuccess?.(...args);
      queryClient.resetQueries({ queryKey: [COMPANIES_QUERY_KEY] });
    },
  });
}

export function useUpdateCompany(
  options?: MutationOptions<UpdateCompanyResponse, ApiError, { id: number; data: UpdateCompanyRequest }>
) {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCompanyRequest }) => companyApi(tenantId).update(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.resetQueries({ queryKey: [COMPANIES_QUERY_KEY] });
      queryClient.resetQueries({ queryKey: [COMPANIES_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteCompany() {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companyApi(tenantId).delete,
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: [COMPANIES_QUERY_KEY] });
    },
  });
}
