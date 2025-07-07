import { useMutation, useQuery, useQueryClient, type MutationOptions } from '@tanstack/react-query';

import { companyApi } from './api';

import type {
  CreateCompanyRequest,
  CreateCompanyResponse,
  UpdateCompanyRequest,
  UpdateCompanyResponse,
} from '@tradelink/shared';
import type { GetAllCompaniesQuery } from '@tradelink/shared/company';
import type { ApiError } from '../client';

const COMPANIES_QUERY_KEY = 'companies';

export function useGetAllCompanies(query: Partial<GetAllCompaniesQuery>) {
  return useQuery({
    queryKey: [COMPANIES_QUERY_KEY, query],
    queryFn: () => companyApi.getAll(query),
  });
}

export function useGetCompany(id: number | string) {
  return useQuery({
    queryKey: [COMPANIES_QUERY_KEY, id],
    queryFn: () => companyApi.getById(Number(id)),
    enabled: !!id,
  });
}

export function useCreateCompany(options?: MutationOptions<CreateCompanyResponse, ApiError, CreateCompanyRequest>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companyApi.create,
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCompanyRequest }) => companyApi.update(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.resetQueries({ queryKey: [COMPANIES_QUERY_KEY] });
      queryClient.resetQueries({ queryKey: [COMPANIES_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companyApi.delete,
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: [COMPANIES_QUERY_KEY] });
    },
  });
}
