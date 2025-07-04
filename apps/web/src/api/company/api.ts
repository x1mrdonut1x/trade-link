import { myFetch } from '../client';

import type {
  CreateCompanyRequest,
  CreateCompanyResponse,
  DeleteCompanyResponse,
  GetAllCompaniesQuery,
  GetAllCompaniesResponse,
  GetCompanyResponse,
  UpdateCompanyRequest,
  UpdateCompanyResponse,
} from '@tradelink/shared';

export const companyApi = {
  getAll: (query: Partial<GetAllCompaniesQuery>) => {
    return myFetch<GetAllCompaniesResponse>('companies', { query });
  },

  getById: (id: number) => {
    return myFetch<GetCompanyResponse>(`companies/${id}`);
  },

  create: (data: CreateCompanyRequest) => {
    return myFetch<CreateCompanyResponse>('companies', { method: 'POST', body: data });
  },

  update: (id: number, data: UpdateCompanyRequest) => {
    return myFetch<UpdateCompanyResponse>(`companies/${id}`, { method: 'PUT', body: data });
  },

  delete: (id: number) => {
    return myFetch<DeleteCompanyResponse>(`companies/${id}`, { method: 'DELETE' });
  },
};
