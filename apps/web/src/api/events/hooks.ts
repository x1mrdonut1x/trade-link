import { useMutation, useQuery, useQueryClient, type MutationOptions } from '@tanstack/react-query';
import { useTenantParam } from 'hooks/use-tenant-param';
import { eventsApi } from './api';

import type {
  CreateEventRequest,
  CreateEventResponse,
  DeleteEventResponse,
  EventDto,
  GetAllEventsQuery,
  UpdateEventRequest,
  UpdateEventResponse,
} from '@tradelink/shared';
import type { ApiError } from 'api/client.util';

const EVENTS_QUERY_KEY = 'events';

export function useGetAllEvents(query?: Partial<GetAllEventsQuery>) {
  const tenantId = useTenantParam();

  return useQuery({
    queryKey: [EVENTS_QUERY_KEY, query],
    queryFn: () => eventsApi(tenantId).getAll(query),
  });
}

export function useGetEvent(id: number | string) {
  const tenantId = useTenantParam();

  return useQuery({
    queryKey: [EVENTS_QUERY_KEY, id],
    queryFn: () => eventsApi(tenantId).getById(Number(id)),
  });
}

export function useCreateEvent(options?: MutationOptions<CreateEventResponse, ApiError, CreateEventRequest>) {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventRequest) => eventsApi(tenantId).create(data),
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY] });
    },
  });
}

export function useUpdateEvent(
  options?: MutationOptions<UpdateEventResponse, ApiError, { id: number; data: UpdateEventRequest }>
) {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEventRequest }) => eventsApi(tenantId).update(id, data),
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY, data.id] });
    },
  });
}

export function useDeleteEvent(options?: MutationOptions<DeleteEventResponse, ApiError, number>) {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => eventsApi(tenantId).delete(id),
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY] });
    },
  });
}

export function useAssignEventTags(options?: MutationOptions<EventDto, ApiError, { id: number; tagIds: number[] }>) {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, tagIds }: { id: number; tagIds: number[] }) => eventsApi(tenantId).assignTags(id, tagIds),
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY, data.id] });
    },
  });
}

export function useUnassignEventTags(options?: MutationOptions<EventDto, ApiError, { id: number; tagIds: number[] }>) {
  const tenantId = useTenantParam();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, tagIds }: { id: number; tagIds: number[] }) => eventsApi(tenantId).unassignTags(id, tagIds),
    ...options,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
      queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY, data.id] });
    },
  });
}
