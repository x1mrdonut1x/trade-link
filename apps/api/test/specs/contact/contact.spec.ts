import { initClient } from 'test/helpers/auth/auth.helper';
import { createCompany } from '../../helpers/company/company.helper';
import {
  contactFixtures,
  createContact,
  deleteContact,
  getAllContacts,
  getContact,
  updateContact,
} from '../../helpers/contact/contact.helper';
import { resetDatabase } from '../../setupFilesAfterEnv';

describe('Contact Controller (e2e)', () => {
  let authToken: string;

  beforeEach(async () => {
    await resetDatabase();
    await initClient();
  });

  describe('POST /contacts', () => {
    it('should create a new contact successfully', async () => {
      const response = await createContact(contactFixtures.validContact);

      expect(response).toHaveProperty('id');
      expect(response.firstName).toBe(contactFixtures.validContact.firstName);
      expect(response.lastName).toBe(contactFixtures.validContact.lastName);
      expect(response.email).toBe(contactFixtures.validContact.email);
      expect(response.jobTitle).toBe(contactFixtures.validContact.jobTitle);
    });

    it('should create contact with company association', async () => {
      // First create a company
      const companyResponse = await createCompany({
        name: 'Test Company',
        email: 'test@company.com',
      });
      expect(companyResponse).toHaveProperty('id');

      // Create contact with company association
      const contactData = {
        ...contactFixtures.validContact,
        companyId: companyResponse.id,
      };

      const response = await createContact(contactData);

      expect(response).toHaveProperty('id');
      expect(response.companyId).toBe(companyResponse.id);
      expect(response.company).toBeDefined();
      expect(response.company.name).toBe('Test Company');
    });

    it('should not create contact with duplicate email', async () => {
      await createContact(contactFixtures.validContact);

      await expect(createContact(contactFixtures.validContact)).rejects.toThrow();
    });

    it('should validate required fields', async () => {
      await expect(createContact(contactFixtures.invalidContact as any)).rejects.toThrow();
    });
  });

  describe('GET /contacts', () => {
    beforeEach(async () => {
      await createContact(contactFixtures.validContact);
      await createContact(contactFixtures.secondContact);
    });

    it('should get all contacts', async () => {
      const response = await getAllContacts();

      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBe(2);
      expect(response[0]).toHaveProperty('id');
      expect(response[0]).toHaveProperty('firstName');
      expect(response[0]).toHaveProperty('lastName');
      expect(response[0]).toHaveProperty('email');
    });

    it('should filter contacts by search query', async () => {
      const response = await getAllContacts({ search: 'John' });

      expect(response.length).toBe(1);
      expect(response[0].firstName).toBe('John');
    });
  });

  describe('GET /contacts/:id', () => {
    let contactId: number;

    beforeEach(async () => {
      const createResponse = await createContact(contactFixtures.validContact);
      contactId = createResponse.id;
    });

    it('should get contact by id', async () => {
      const response = await getContact(contactId);

      expect(response.id).toBe(contactId);
      expect(response.firstName).toBe(contactFixtures.validContact.firstName);
      expect(response.lastName).toBe(contactFixtures.validContact.lastName);
      expect(response.email).toBe(contactFixtures.validContact.email);
    });

    it('should return 404 for non-existent contact', async () => {
      await expect(getContact(999)).rejects.toThrow();
    });
  });

  describe('PUT /contacts/:id', () => {
    let contactId: number;

    beforeEach(async () => {
      const createResponse = await createContact(contactFixtures.validContact);
      contactId = createResponse.id;
    });

    it('should update contact successfully', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        jobTitle: 'Senior Engineer',
      };

      const response = await updateContact(contactId, updateData);

      expect(response.firstName).toBe(updateData.firstName);
      expect(response.lastName).toBe(updateData.lastName);
      expect(response.jobTitle).toBe(updateData.jobTitle);
      expect(response.email).toBe(contactFixtures.validContact.email); // unchanged
    });

    it('should not update contact with duplicate email', async () => {
      await createContact(contactFixtures.secondContact);

      await expect(
        updateContact(contactId, {
          email: contactFixtures.secondContact.email,
        })
      ).rejects.toThrow();
    });

    it('should return 404 for non-existent contact', async () => {
      await expect(updateContact(999, { firstName: 'Test' })).rejects.toThrow();
    });
  });

  describe('DELETE /contacts/:id', () => {
    let contactId: number;

    beforeEach(async () => {
      const createResponse = await createContact(contactFixtures.validContact);
      contactId = createResponse.id;
    });

    it('should delete contact successfully', async () => {
      const response = await deleteContact(contactId);

      expect(response.message).toBeDefined();

      // Verify contact is deleted
      await expect(getContact(contactId)).rejects.toThrow();
    });

    it('should return 404 for non-existent contact', async () => {
      await expect(deleteContact(999)).rejects.toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should complete full CRUD operations', async () => {
      // Create
      const createResponse = await createContact(contactFixtures.validContact);
      expect(createResponse).toHaveProperty('id');
      const contactId = createResponse.id;

      // Read
      const getResponse = await getContact(contactId);
      expect(getResponse.id).toBe(contactId);

      // Update
      const updateResponse = await updateContact(contactId, {
        firstName: 'Updated',
        jobTitle: 'Senior Engineer',
      });
      expect(updateResponse.firstName).toBe('Updated');

      // Delete
      const deleteResponse = await deleteContact(contactId);
      expect(deleteResponse.message).toBeDefined();

      // Verify deletion
      await expect(getContact(contactId)).rejects.toThrow();
    });

    it('should handle contact with company relationship', async () => {
      // Create company
      const companyResponse = await createCompany({
        name: 'Test Company',
        email: 'test@company.com',
      });
      expect(companyResponse).toHaveProperty('id');

      // Create contact with company
      const contactData = {
        ...contactFixtures.validContact,
        companyId: companyResponse.id,
      };
      const contactResponse = await createContact(contactData);
      expect(contactResponse).toHaveProperty('id');

      // Verify company relationship
      const getResponse = await getContact(contactResponse.id);
      expect(getResponse.company).toBeDefined();
      expect(getResponse.company.name).toBe('Test Company');
    });
  });
});
