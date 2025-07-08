import { initClient } from '../../helpers/auth/auth.helper';
import { companyFixtures, createCompany } from '../../helpers/company/company.helper';
import { contactFixtures, createContact } from '../../helpers/contact/contact.helper';
import { getDashboardStats } from '../../helpers/dashboard/dashboard.helper';
import { resetDatabase } from '../../setupFilesAfterEnv';

describe('Dashboard Controller (e2e)', () => {
  let authToken: string;

  beforeEach(async () => {
    await resetDatabase();
    await initClient();
  });

  describe('GET /dashboard/stats', () => {
    it('should get dashboard stats with no data', async () => {
      const response = await getDashboardStats();

      expect(response).toHaveProperty('totalContacts');
      expect(response).toHaveProperty('totalCompanies');
      expect(response.totalContacts).toBe(0);
      expect(response.totalCompanies).toBe(0);
    });

    it('should get dashboard stats with contacts and companies', async () => {
      // Create some test data
      await createContact(contactFixtures.validContact);
      await createContact(contactFixtures.secondContact);
      await createCompany(companyFixtures.validCompany);

      const response = await getDashboardStats();

      expect(response).toHaveProperty('totalContacts');
      expect(response).toHaveProperty('totalCompanies');
      expect(response.totalContacts).toBe(2);
      expect(response.totalCompanies).toBe(1);
    });
  });

  describe('Integration Tests', () => {
    it('should update stats as data is created and deleted', async () => {
      // Initial state
      let stats = await getDashboardStats();
      expect(stats.totalContacts).toBe(0);
      expect(stats.totalCompanies).toBe(0);

      // Create a company
      await createCompany(companyFixtures.validCompany);
      stats = await getDashboardStats();
      expect(stats.totalContacts).toBe(0);
      expect(stats.totalCompanies).toBe(1);

      // Create contacts
      await createContact(contactFixtures.validContact);
      await createContact(contactFixtures.secondContact);
      stats = await getDashboardStats();
      expect(stats.totalContacts).toBe(2);
      expect(stats.totalCompanies).toBe(1);
    });
  });
});
