import type {
  CreateCompanyRequest,
  CreateCompanyResponse,
  DeleteCompanyResponse,
  GetAllCompaniesResponse,
  GetCompanyResponse,
  UpdateCompanyRequest,
  UpdateCompanyResponse,
} from '@tradelink/shared';
import { myFetch } from '../client';

export const companyApi = {
  getAll: (search?: string) => {
    return myFetch<GetAllCompaniesResponse[]>('companies', { query: search ? { search } : undefined });
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
