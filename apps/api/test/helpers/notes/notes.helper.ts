import {
  CreateNoteRequest,
  CreateNoteResponse,
  GetAllNotesResponse,
  GetNoteResponse,
  type DeleteNoteResponse,
  type GetAllNotesRequest,
  type UpdateNoteRequest,
  type UpdateNoteResponse,
} from '@tradelink/shared';
import { authRequest } from '../request.helper';

export interface NoteFixtures {
  validContactNote: CreateNoteRequest;
  validCompanyNote: CreateNoteRequest;
  validNoteWithoutDescription: CreateNoteRequest;
  updateNote: UpdateNoteRequest;
  invalidNote: Partial<CreateNoteRequest>;
}

export const noteFixtures: NoteFixtures = {
  validContactNote: {
    title: 'Contact Follow-up',
    description: 'Need to follow up with this contact about the project proposal.',
    contactId: 1,
    companyId: null,
  },
  validCompanyNote: {
    title: 'Company Meeting Notes',
    description: 'Discussion about potential partnership opportunities.',
    contactId: null,
    companyId: 1,
  },
  validNoteWithoutDescription: {
    title: 'Quick Note',
    description: null,
    contactId: 1,
    companyId: null,
  },
  updateNote: {
    title: 'Updated Note Title',
    description: 'Updated description for the note.',
  },
  invalidNote: {
    // Missing required title field
    description: 'Invalid note without required fields',
  },
};

export const getAllNotes = async (query?: GetAllNotesRequest) => {
  return authRequest().get<GetAllNotesResponse>('/notes', query);
};

export const getNote = async (id: number) => {
  return authRequest().get<GetNoteResponse>(`/notes/${id}`);
};

export const createNote = async (data: CreateNoteRequest) => {
  return authRequest().post<CreateNoteResponse>('/notes', data);
};

export const updateNote = async (id: number, data: UpdateNoteRequest) => {
  return authRequest().patch<UpdateNoteResponse>(`/notes/${id}`, data);
};

export const deleteNote = async (id: number) => {
  return authRequest().delete<DeleteNoteResponse>(`/notes/${id}`);
};
