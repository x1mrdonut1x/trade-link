import { useMutation, useQuery, useQueryClient, type MutationOptions } from '@tanstack/react-query';
import type { CreateCompanyRequest, CreateCompanyResponse, UpdateCompanyRequest, UpdateCompanyResponse } from '@tradelink/shared';
import { companyApi } from './api';

const COMPANIES_QUERY_KEY = 'companies';

export function useGetAllCompanies(search?: string) {
  return useQuery({
    queryKey: [COMPANIES_QUERY_KEY, search],
    queryFn: () => companyApi.getAll(search),
  });
}

export function useGetCompany(id: number | string) {
  return useQuery({
    queryKey: [COMPANIES_QUERY_KEY, id],
    queryFn: () => companyApi.getById(Number(id)),
    enabled: !!id,
  });
}

export function useCreateCompany(options?: MutationOptions<CreateCompanyResponse, Error, CreateCompanyRequest>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companyApi.create,
    ...options,
    onSuccess: (...args) => {
      options?.onSuccess?.(...args);
      queryClient.invalidateQueries({ queryKey: [COMPANIES_QUERY_KEY] });
    },
  });
}

export function useUpdateCompany(options?: MutationOptions<UpdateCompanyResponse, Error, { id: number; data: UpdateCompanyRequest }>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCompanyRequest }) => companyApi.update(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.invalidateQueries({ queryKey: [COMPANIES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [COMPANIES_QUERY_KEY, variables.id] });
    },
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: companyApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMPANIES_QUERY_KEY] });
    },
  });
}
