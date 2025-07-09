import type {
  CreateEventRequestInput,
  CreateEventResponse,
  DeleteEventResponse,
  EventDto,
  GetAllEventsResponse,
  GetEventResponse,
  UpdateEventRequest,
  UpdateEventResponse,
} from '@tradelink/shared';
import { authRequest } from '../request.helper';

export const createEvent = async (data: CreateEventRequestInput): Promise<CreateEventResponse> => {
  return authRequest().post('/events', data);
};

export const getAllEvents = async (query?: Record<string, any>): Promise<GetAllEventsResponse> => {
  return authRequest().get('/events', query);
};

export const getEvent = async (id: number): Promise<GetEventResponse> => {
  return authRequest().get(`/events/${id}`);
};

export const updateEvent = async (id: number, data: UpdateEventRequest): Promise<UpdateEventResponse> => {
  return authRequest().put(`/events/${id}`, data);
};

export const deleteEvent = async (id: number): Promise<DeleteEventResponse> => {
  return authRequest().delete(`/events/${id}`);
};

export const assignEventTags = async (eventId: number, tagIds: number[]): Promise<EventDto> => {
  return authRequest().patch(`/events/${eventId}/tags/assign`, { tagIds });
};

export const unassignEventTags = async (eventId: number, tagIds: number[]): Promise<EventDto> => {
  return authRequest().patch(`/events/${eventId}/tags/unassign`, { tagIds });
};
