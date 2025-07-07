import {
  CreateContactRequest,
  GetAllContactsResponse,
  GetContactResponse,
  UpdateContactRequest,
  type CreateContactResponse,
  type DeleteContactResponse,
  type GetAllContactsQuery,
  type UpdateContactResponse,
} from '@tradelink/shared';
import { authRequest } from '../request.helper';

export interface ContactFixtures {
  validContact: CreateContactRequest;
  secondContact: CreateContactRequest;
  invalidContact: Partial<CreateContactRequest>;
}

export const contactFixtures: ContactFixtures = {
  validContact: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    jobTitle: 'Software Engineer',
    phonePrefix: '+1',
    phoneNumber: '555-0123',
    address: '123 Main Street',
    city: 'New York',
    country: 'United States',
    postCode: '10001',
    companyId: null,
  },
  secondContact: {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    jobTitle: 'Product Manager',
    phonePrefix: '+44',
    phoneNumber: '020-7946-0958',
    address: '456 London Street',
    city: 'London',
    country: 'United Kingdom',
    postCode: 'SW1A 1AA',
    companyId: null,
  },
  invalidContact: {
    // Missing required firstName, lastName, and email fields
    jobTitle: 'Invalid Contact',
  },
};

export const getAllContacts = async (query?: GetAllContactsQuery) => {
  return authRequest().get<GetAllContactsResponse>('/contacts', query);
};

export const getContact = async (id: number) => {
  return authRequest().get<GetContactResponse>(`/contacts/${id}`);
};

export const createContact = async (contactData: CreateContactRequest) => {
  return authRequest().post<CreateContactResponse>('/contacts', contactData);
};

export const updateContact = async (id: number, contactData: UpdateContactRequest) => {
  return authRequest().put<UpdateContactResponse>(`/contacts/${id}`, contactData);
};

export const deleteContact = async (id: number) => {
  return authRequest().delete<DeleteContactResponse>(`/contacts/${id}`);
};
