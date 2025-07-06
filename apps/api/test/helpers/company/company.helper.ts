import type { CreateCompanyRequest, UpdateCompanyRequest } from '@tradelink/shared';
import { authRequest } from '../request.helper';

export interface CompanyFixtures {
  validCompany: CreateCompanyRequest;
  secondCompany: CreateCompanyRequest;
  invalidCompany: Partial<CreateCompanyRequest>;
}

export const companyFixtures: CompanyFixtures = {
  validCompany: {
    name: 'Test Company Inc',
    email: 'info@testcompany.com',
    description: 'A test company for automated testing',
    phonePrefix: '+1',
    phoneNumber: '555-0123',
    address: '123 Test Street',
    city: 'Test City',
    country: 'United States',
    postCode: '12345',
    size: 'Medium',
    website: 'https://testcompany.com',
  },
  secondCompany: {
    name: 'Second Test Company',
    email: 'contact@secondtest.com',
    description: 'Another test company',
    phonePrefix: '+44',
    phoneNumber: '020-7946-0958',
    address: '456 Another Street',
    city: 'London',
    country: 'United Kingdom',
    postCode: 'SW1A 1AA',
    size: 'Large',
    website: 'https://secondtest.com',
  },
  invalidCompany: {
    // Missing required name field - this should cause validation to fail
    email: 'invalid@company.com',
    description: 'Invalid company without name',
  },
};

export const getAllCompanies = async (query?: Record<string, string>) => {
  const url = query ? `/companies?${new URLSearchParams(query).toString()}` : '/companies';
  return authRequest().get(url);
};

export const getCompany = async (id: number) => {
  return authRequest().get(`/companies/${id}`);
};

export const createCompany = async (companyData: CreateCompanyRequest) => {
  return authRequest().post('/companies', companyData);
};

export const updateCompany = async (id: number, companyData: UpdateCompanyRequest) => {
  return authRequest().put(`/companies/${id}`, companyData);
};

export const deleteCompany = async (id: number) => {
  return authRequest().delete(`/companies/${id}`);
};
