import { myFetch } from '../client';

import type {
  CreateNoteRequest,
  CreateNoteResponse,
  DeleteNoteResponse,
  GetAllNotesRequest,
  GetAllNotesResponse,
  GetNoteResponse,
  UpdateNoteRequest,
  UpdateNoteResponse,
} from '@tradelink/shared';

export const notesApi = (tenantId: string) => ({
  getAllNotes: (query?: GetAllNotesRequest) => {
    return myFetch<GetAllNotesResponse>(tenantId, 'notes', { query });
  },

  getNote: (id: number | string) => {
    return myFetch<GetNoteResponse>(tenantId, `notes/${id}`);
  },

  createNote: (data: CreateNoteRequest) => {
    return myFetch<CreateNoteResponse>(tenantId, 'notes', { method: 'POST', body: data });
  },

  updateNote: (id: number | string, data: UpdateNoteRequest) => {
    return myFetch<UpdateNoteResponse>(tenantId, `notes/${id}`, { method: 'PATCH', body: data });
  },

  deleteNote: (id: number | string) => {
    return myFetch<DeleteNoteResponse>(tenantId, `notes/${id}`, { method: 'DELETE' });
  },

  getNotesByContactId: (contactId: number | string) => {
    return myFetch<GetAllNotesResponse>(tenantId, `notes/contact/${contactId}`);
  },

  getNotesByCompanyId: (companyId: number | string) => {
    return myFetch<GetAllNotesResponse>(tenantId, `notes/company/${companyId}`);
  },
});
