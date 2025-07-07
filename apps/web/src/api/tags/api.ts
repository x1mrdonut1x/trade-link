import { myFetch } from '../client';

import type {
  AssignTagsRequest,
  CreateTagRequest,
  CreateTagResponse,
  DeleteTagResponse,
  GetAllTagsQuery,
  GetAllTagsResponse,
  GetTagResponse,
  UnassignTagsRequest,
  UpdateTagRequest,
  UpdateTagResponse,
} from '@tradelink/shared';

export const tagApi = {
  getAllTags: (query?: GetAllTagsQuery) => {
    return myFetch<GetAllTagsResponse>('tags', { query });
  },

  getTag: (id: number | string) => {
    return myFetch<GetTagResponse>(`tags/${id}`);
  },

  createTag: (data: CreateTagRequest) => {
    return myFetch<CreateTagResponse>('tags', { method: 'POST', body: data });
  },

  updateTag: (id: number | string, data: UpdateTagRequest) => {
    return myFetch<UpdateTagResponse>(`tags/${id}`, { method: 'PUT', body: data });
  },

  deleteTag: (id: number | string) => {
    return myFetch<DeleteTagResponse>(`tags/${id}`, { method: 'DELETE' });
  },

  assignTagsToCompany: (companyId: number | string, data: AssignTagsRequest) => {
    return myFetch(`companies/${companyId}/tags/assign`, { method: 'PATCH', body: data });
  },

  unassignTagsFromCompany: (companyId: number | string, data: UnassignTagsRequest) => {
    return myFetch(`companies/${companyId}/tags/unassign`, { method: 'PATCH', body: data });
  },

  assignTagsToContact: (contactId: number | string, data: AssignTagsRequest) => {
    return myFetch(`contacts/${contactId}/tags/assign`, { method: 'PATCH', body: data });
  },

  unassignTagsFromContact: (contactId: number | string, data: UnassignTagsRequest) => {
    return myFetch(`contacts/${contactId}/tags/unassign`, { method: 'PATCH', body: data });
  },
};
