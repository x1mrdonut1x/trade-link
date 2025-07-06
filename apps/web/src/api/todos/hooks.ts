import { useMutation, useQuery, useQueryClient, type MutationOptions } from '@tanstack/react-query';

import { todosApi } from './api';

import type {
  CreateTodoRequest,
  CreateTodoResponse,
  DeleteTodoResponse,
  GetAllTodosQueryDto,
  UpdateTodoRequest,
  UpdateTodoResponse,
} from '@tradelink/shared';

const TODOS_QUERY_KEY = 'todos';

export function useGetAllTodos(query?: GetAllTodosQueryDto) {
  return useQuery({
    queryKey: [TODOS_QUERY_KEY, query],
    queryFn: () => todosApi.getAllTodos(query),
  });
}

export function useGetTodo(id: number | string) {
  return useQuery({
    queryKey: [TODOS_QUERY_KEY, id],
    queryFn: () => todosApi.getTodo(id),
    enabled: !!id,
  });
}

export function useGetTodosByContactId(contactId: number | string) {
  return useQuery({
    queryKey: [TODOS_QUERY_KEY, 'contact', contactId],
    queryFn: () => todosApi.getTodosByContactId(contactId),
    enabled: !!contactId,
  });
}

export function useGetTodosByCompanyId(companyId: number | string) {
  return useQuery({
    queryKey: [TODOS_QUERY_KEY, 'company', companyId],
    queryFn: () => todosApi.getTodosByCompanyId(companyId),
    enabled: !!companyId,
  });
}

export function useCreateTodo(options?: MutationOptions<CreateTodoResponse, Error, CreateTodoRequest>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todosApi.createTodo,
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

export function useUpdateTodo(
  options?: MutationOptions<UpdateTodoResponse, Error, { id: number; data: UpdateTodoRequest }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTodoRequest }) => todosApi.updateTodo(id, data),
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

export function useResolveTodo(options?: MutationOptions<UpdateTodoResponse, Error, number>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todosApi.resolveTodo,
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.resetQueries({ queryKey: [TODOS_QUERY_KEY] });
      queryClient.resetQueries({ queryKey: [TODOS_QUERY_KEY, variables] });
    },
  });
}

export function useUnresolveTodo(options?: MutationOptions<UpdateTodoResponse, Error, number>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todosApi.unresolveTodo,
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.resetQueries({ queryKey: [TODOS_QUERY_KEY] });
      queryClient.resetQueries({ queryKey: [TODOS_QUERY_KEY, variables] });
    },
  });
}

export function useDeleteTodo(options?: MutationOptions<DeleteTodoResponse, Error, number>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todosApi.deleteTodo,
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.resetQueries({ queryKey: [TODOS_QUERY_KEY] });
      queryClient.removeQueries({ queryKey: [TODOS_QUERY_KEY, variables] });
    },
  });
}
