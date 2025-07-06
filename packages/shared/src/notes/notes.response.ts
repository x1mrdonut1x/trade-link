import type { CompanyDto } from '../company';
import type { ContactDto } from '../contact';

export interface UserMinimalDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface NoteDto {
  id: number;
  title: string;
  description?: string | null;
  contactId?: number | null;
  companyId?: number | null;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

export type NoteWithRelationsDto = NoteDto & {
  contact?: ContactDto | null;
  company?: CompanyDto | null;
  user?: UserMinimalDto | null;
};

export type GetNoteResponse = NoteWithRelationsDto;

export type GetAllNotesResponse = NoteWithRelationsDto[];

export type CreateNoteResponse = NoteWithRelationsDto;

export type UpdateNoteResponse = NoteWithRelationsDto;

export type DeleteNoteResponse = {
  id: number;
};
