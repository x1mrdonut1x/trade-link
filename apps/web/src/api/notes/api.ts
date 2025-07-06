import { myFetch } from '../client';

import type {
  CreateNoteRequest,
  CreateNoteResponse,
  DeleteNoteResponse,
  GetAllNotesResponse,
  GetNoteResponse,
  UpdateNoteRequest,
  UpdateNoteResponse,
} from '@tradelink/shared';

export const notesApi = {
  getAllNotes: () => {
    return myFetch<GetAllNotesResponse>('notes');
  },

  getNote: (id: number | string) => {
    return myFetch<GetNoteResponse>(`notes/${id}`);
  },

  createNote: (data: CreateNoteRequest) => {
    return myFetch<CreateNoteResponse>('notes', { method: 'POST', body: data });
  },

  updateNote: (id: number | string, data: UpdateNoteRequest) => {
    return myFetch<UpdateNoteResponse>(`notes/${id}`, { method: 'PATCH', body: data });
  },

  deleteNote: (id: number | string) => {
    return myFetch<DeleteNoteResponse>(`notes/${id}`, { method: 'DELETE' });
  },

  getNotesByContactId: (contactId: number | string) => {
    return myFetch<GetAllNotesResponse>(`notes/contact/${contactId}`);
  },

  getNotesByCompanyId: (companyId: number | string) => {
    return myFetch<GetAllNotesResponse>(`notes/company/${companyId}`);
  },
};
