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

export const companyApi = (tenantId: string) => ({
  getAll: (query: Partial<GetAllCompaniesQuery>) => {
    return myFetch<GetAllCompaniesResponse>(tenantId, 'companies', { query });
  },

  getById: (id: number) => {
    return myFetch<GetCompanyResponse>(tenantId, `companies/${id}`);
  },

  create: (data: CreateCompanyRequest) => {
    return myFetch<CreateCompanyResponse>(tenantId, 'companies', { method: 'POST', body: data });
  },

  update: (id: number, data: UpdateCompanyRequest) => {
    return myFetch<UpdateCompanyResponse>(tenantId, `companies/${id}`, { method: 'PUT', body: data });
  },

  delete: (id: number) => {
    return myFetch<DeleteCompanyResponse>(tenantId, `companies/${id}`, { method: 'DELETE' });
  },
});
