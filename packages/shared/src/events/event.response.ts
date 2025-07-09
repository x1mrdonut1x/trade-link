import type { TagDto } from '../tags';

export interface EventDto {
  id: number;
  name: string;
  type: string;
  startDate: string;
  endDate: string;
  location: string;
  venue: string | null;
  description: string | null;
  status: string;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
  tags?: TagDto[];
}

export interface CompanyEventDto {
  id: number;
  name: string;
  contactsCount: number;
}

export interface ContactEventDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string | null;
  companyName: string | null;
}

export interface EventScheduleDto {
  id: number;
  time: string;
  title: string;
  description: string | null;
  type: string;
  location: string | null;
  contacts: ContactEventDto[];
}

export type GetEventResponse = EventDto & {
  companies: CompanyEventDto[];
  contacts: ContactEventDto[];
  schedule: EventScheduleDto[];
};

export type GetAllEventsResponse = EventDto[];

export type CreateEventResponse = EventDto;

export type UpdateEventResponse = EventDto;

export type DeleteEventResponse = {
  success: boolean;
  message: string;
};
