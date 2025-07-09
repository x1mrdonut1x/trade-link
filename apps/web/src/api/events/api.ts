import { myFetch } from '../client';

import type {
  CreateEventRequest,
  CreateEventResponse,
  DeleteEventResponse,
  EventDto,
  GetAllEventsQuery,
  GetAllEventsResponse,
  GetEventResponse,
  UpdateEventRequest,
  UpdateEventResponse,
} from '@tradelink/shared';

export const eventsApi = (tenantId: string) => ({
  getAll: (query?: Partial<GetAllEventsQuery>) => {
    return myFetch<GetAllEventsResponse>(tenantId, 'events', { query });
  },

  getById: (id: number) => {
    return myFetch<GetEventResponse>(tenantId, `events/${id}`);
  },

  create: (data: CreateEventRequest) => {
    return myFetch<CreateEventResponse>(tenantId, 'events', { method: 'POST', body: data });
  },

  update: (id: number, data: UpdateEventRequest) => {
    return myFetch<UpdateEventResponse>(tenantId, `events/${id}`, { method: 'PUT', body: data });
  },

  delete: (id: number) => {
    return myFetch<DeleteEventResponse>(tenantId, `events/${id}`, { method: 'DELETE' });
  },

  assignTags: (id: number, tagIds: number[]) => {
    return myFetch<EventDto>(tenantId, `events/${id}/tags/assign`, { method: 'PATCH', body: { tagIds } });
  },

  unassignTags: (id: number, tagIds: number[]) => {
    return myFetch<EventDto>(tenantId, `events/${id}/tags/unassign`, { method: 'PATCH', body: { tagIds } });
  },
});
