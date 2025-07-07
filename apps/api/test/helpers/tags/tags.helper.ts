import {
  CreateTagResponse,
  DeleteTagResponse,
  GetAllTagsResponse,
  GetCompanyResponse,
  GetTagResponse,
  UpdateTagResponse,
  type CreateTagRequest,
  type GetAllTagsQuery,
  type GetContactResponse,
  type UpdateTagRequest,
} from '@tradelink/shared';
import { authRequest } from '../request.helper';

export interface TagFixtures {
  validTag: CreateTagRequest;
  secondTag: CreateTagRequest;
  invalidTag: Partial<CreateTagRequest>;
}

export const tagFixtures: TagFixtures = {
  validTag: {
    name: 'Important',
    color: '#FF0000',
  },
  secondTag: {
    name: 'Prospect',
    color: '#00FF00',
  },
  invalidTag: {
    name: '', // Invalid because name is required
  },
};

export const createTag = (data: CreateTagRequest) => {
  return authRequest().post<CreateTagResponse>('/tags', data);
};

export const getAllTags = (query?: GetAllTagsQuery) => {
  return authRequest().get<GetAllTagsResponse>('/tags', query);
};

export const getTag = (id: number) => {
  return authRequest().get<GetTagResponse>(`/tags/${id}`);
};

export const updateTag = (id: number, data: UpdateTagRequest) => {
  return authRequest().put<UpdateTagResponse>(`/tags/${id}`, data);
};

export const deleteTag = (id: number) => {
  return authRequest().delete<DeleteTagResponse>(`/tags/${id}`);
};

export const assignTagsToCompany = (companyId: number, tagIds: number[]) => {
  return authRequest().patch<GetCompanyResponse>(`/companies/${companyId}/tags/assign`, { tagIds });
};

export const unassignTagsFromCompany = (companyId: number, tagIds: number[]) => {
  return authRequest().patch<GetCompanyResponse>(`/companies/${companyId}/tags/unassign`, { tagIds });
};

export const assignTagsToContact = (contactId: number, tagIds: number[]) => {
  return authRequest().patch<GetContactResponse>(`/contacts/${contactId}/tags/assign`, { tagIds });
};

export const unassignTagsFromContact = (contactId: number, tagIds: number[]) => {
  return authRequest().patch<GetContactResponse>(`/contacts/${contactId}/tags/unassign`, { tagIds });
};
