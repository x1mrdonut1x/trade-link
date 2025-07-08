import { useMutation, useQuery, useQueryClient, type MutationOptions } from '@tanstack/react-query';

import { tasksApi } from './api';

import type {
  CreateTaskRequest,
  CreateTaskResponse,
  DeleteTaskResponse,
  GetAllTasksQueryDto,
  UpdateTaskRequest,
  UpdateTaskResponse,
} from '@tradelink/shared';
import { useTenantParam } from 'hooks/use-tenant-param';

const TODOS_QUERY_KEY = 'tasks';

export function useGetAllTasks(query?: GetAllTasksQueryDto) {
  const tenantId = useTenantParam();

  return useQuery({
    queryKey: [TODOS_QUERY_KEY, query],
    queryFn: () => tasksApi(tenantId).getAllTasks(query),
  });
}

export function useGetTask(id: number | string) {
  const tenantId = useTenantParam();

  return useQuery({
    queryKey: [TODOS_QUERY_KEY, id],
    queryFn: () => tasksApi(tenantId).getTask(id),
    enabled: !!id,
  });
}

export function useCreateTask(options?: MutationOptions<CreateTaskResponse, Error, CreateTaskRequest>) {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksApi(tenantId).createTask,
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.resetQueries({ queryKey: [TODOS_QUERY_KEY] });
      if (variables.contactId) {
        queryClient.resetQueries({ queryKey: [TODOS_QUERY_KEY, 'contact', variables.contactId] });
      }
      if (variables.companyId) {
        queryClient.resetQueries({ queryKey: [TODOS_QUERY_KEY, 'company', variables.companyId] });
      }
    },
  });
}

export function useUpdateTask(
  options?: MutationOptions<UpdateTaskResponse, Error, { id: number; data: UpdateTaskRequest }>
) {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskRequest }) => tasksApi(tenantId).updateTask(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.resetQueries({ queryKey: [TODOS_QUERY_KEY] });
      queryClient.resetQueries({ queryKey: [TODOS_QUERY_KEY, variables.id] });
      if (data.contactId) {
        queryClient.resetQueries({ queryKey: [TODOS_QUERY_KEY, 'contact', data.contactId] });
      }
      if (data.companyId) {
        queryClient.resetQueries({ queryKey: [TODOS_QUERY_KEY, 'company', data.companyId] });
      }
    },
  });
}

export function useResolveTask(options?: MutationOptions<UpdateTaskResponse, Error, number>) {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksApi(tenantId).resolveTask,
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.resetQueries({ queryKey: [TODOS_QUERY_KEY] });
      queryClient.resetQueries({ queryKey: [TODOS_QUERY_KEY, variables] });
    },
  });
}

export function useUnresolveTask(options?: MutationOptions<UpdateTaskResponse, Error, number>) {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksApi(tenantId).unresolveTask,
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.resetQueries({ queryKey: [TODOS_QUERY_KEY] });
      queryClient.resetQueries({ queryKey: [TODOS_QUERY_KEY, variables] });
    },
  });
}

export function useDeleteTask(options?: MutationOptions<DeleteTaskResponse, Error, number>) {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tasksApi(tenantId).deleteTask,
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.resetQueries({ queryKey: [TODOS_QUERY_KEY] });
      queryClient.removeQueries({ queryKey: [TODOS_QUERY_KEY, variables] });
    },
  });
}
