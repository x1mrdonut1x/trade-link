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

export const tagApi = (tenantId: string) => ({
  getAllTags: (query?: GetAllTagsQuery) => {
    return myFetch<GetAllTagsResponse>(tenantId, 'tags', { query });
  },

  getTag: (id: number | string) => {
    return myFetch<GetTagResponse>(tenantId, `tags/${id}`);
  },

  createTag: (data: CreateTagRequest) => {
    return myFetch<CreateTagResponse>(tenantId, 'tags', { method: 'POST', body: data });
  },

  updateTag: (id: number | string, data: UpdateTagRequest) => {
    return myFetch<UpdateTagResponse>(tenantId, `tags/${id}`, { method: 'PUT', body: data });
  },

  deleteTag: (id: number | string) => {
    return myFetch<DeleteTagResponse>(tenantId, `tags/${id}`, { method: 'DELETE' });
  },

  assignTagsToCompany: (companyId: number | string, data: AssignTagsRequest) => {
    return myFetch(tenantId, `companies/${companyId}/tags/assign`, { method: 'PATCH', body: data });
  },

  unassignTagsFromCompany: (companyId: number | string, data: UnassignTagsRequest) => {
    return myFetch(tenantId, `companies/${companyId}/tags/unassign`, { method: 'PATCH', body: data });
  },

  assignTagsToContact: (contactId: number | string, data: AssignTagsRequest) => {
    return myFetch(tenantId, `contacts/${contactId}/tags/assign`, { method: 'PATCH', body: data });
  },

  unassignTagsFromContact: (contactId: number | string, data: UnassignTagsRequest) => {
    return myFetch(tenantId, `contacts/${contactId}/tags/unassign`, { method: 'PATCH', body: data });
  },
});
