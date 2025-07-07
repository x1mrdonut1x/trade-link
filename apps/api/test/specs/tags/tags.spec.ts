import { createAuthenticatedUser } from '../../helpers/auth/auth.helper';
import { companyFixtures, createCompany, getAllCompanies } from '../../helpers/company/company.helper';
import { contactFixtures, createContact } from '../../helpers/contact/contact.helper';
import {
  assignTagsToCompany,
  assignTagsToContact,
  createTag,
  deleteTag,
  getAllTags,
  getTag,
  tagFixtures,
  unassignTagsFromCompany,
  unassignTagsFromContact,
  updateTag,
} from '../../helpers/tags/tags.helper';
import { resetDatabase, setTestAuthToken } from '../../setupFilesAfterEnv';

describe('Tags', () => {
  let createdTagId: number;
  let createdCompanyId: number;
  let createdContactId: number;

  beforeEach(async () => {
    await resetDatabase();

    // Create authenticated user and set token
    const accessToken = await createAuthenticatedUser();
    setTestAuthToken(accessToken);

    // Create a company and contact for testing tag assignments
    const company = await createCompany(companyFixtures.validCompany);
    createdCompanyId = company.id;

    const contact = await createContact(contactFixtures.validContact);
    createdContactId = contact.id;

    const response = await createTag(tagFixtures.validTag);
    createdTagId = response.id;
  });

  describe('POST /tags', () => {
    it('should create a new tag', async () => {
      const response = await createTag({ ...tagFixtures.validTag, name: 'dupa' });

      expect(response).toHaveProperty('id');
      expect(response.name).toBe('dupa');
      expect(response.color).toBe(tagFixtures.validTag.color);
      expect(response).toHaveProperty('createdAt');
      expect(response).toHaveProperty('updatedAt');
      expect(response).toHaveProperty('createdBy');
    });

    it('should reject tag with invalid data', async () => {
      await expect(createTag(tagFixtures.invalidTag as any)).rejects.toThrow();
    });

    it('should reject tag with duplicate name', async () => {
      await expect(createTag(tagFixtures.validTag)).rejects.toThrow();
    });
  });

  describe('GET /tags', () => {
    it('should get all tags', async () => {
      const response = await getAllTags();

      expect(Array.isArray(response)).toBe(true);
      expect(response).toHaveLength(1);
      expect(response[0]).toHaveProperty('id');
      expect(response[0].name).toBe(tagFixtures.validTag.name);
      expect(response[0].color).toBe(tagFixtures.validTag.color);
    });

    it('should return number of relations', async () => {
      const tag2 = await createTag({ ...tagFixtures.validTag, name: 'tag2' });
      await assignTagsToCompany(createdCompanyId, [createdTagId, tag2.id]);
      await assignTagsToContact(createdContactId, [tag2.id]);

      const response = await getAllTags();

      expect(Array.isArray(response)).toBe(true);
      expect(response).toHaveLength(2);
      expect(response[0]).toHaveProperty('id');
      expect(response[0].name).toBe('tag2');
      expect(response[0].color).toBe(tagFixtures.validTag.color);
      expect(response[0]._count.companies).toBe(1);
      expect(response[0]._count.contacts).toBe(1);
      expect(response[1]).toHaveProperty('id');
      expect(response[1].name).toBe(tagFixtures.validTag.name);
      expect(response[1].color).toBe(tagFixtures.validTag.color);
      expect(response[1]._count.companies).toBe(1);
      expect(response[1]._count.contacts).toBe(0);
    });

    it('should handle pagination', async () => {
      const response = await getAllTags({ page: 1, size: 5 });

      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBeLessThanOrEqual(5);
    });
  });

  describe('GET /tags/:id', () => {
    it('should get a specific tag', async () => {
      const response = await getTag(createdTagId);

      expect(response.id).toBe(createdTagId);
      expect(response.name).toBe(tagFixtures.validTag.name);
      expect(response.color).toBe(tagFixtures.validTag.color);
    });

    it('should return 404 for non-existent tag', async () => {
      await expect(getTag(99_999)).rejects.toThrow();
    });
  });

  describe('PUT /tags/:id', () => {
    it('should update a tag', async () => {
      const updateData = { name: 'Updated Tag', color: '#0000FF' };
      const response = await updateTag(createdTagId, updateData);

      expect(response.id).toBe(createdTagId);
      expect(response.name).toBe(updateData.name);
      expect(response.color).toBe(updateData.color);
    });

    it('should return 404 for non-existent tag', async () => {
      await expect(updateTag(99_999, { name: 'Test' })).rejects.toThrow();
    });
  });

  describe('Tag Assignment to Companies', () => {
    it('should assign tags to a company', async () => {
      const response = await assignTagsToCompany(createdCompanyId, [createdTagId]);

      expect(response).toHaveProperty('id', createdCompanyId);
      expect(response).toHaveProperty('tags');
      expect(response.tags).toEqual(expect.arrayContaining([expect.objectContaining({ id: createdTagId })]));
    });

    it('should unassign tags from a company', async () => {
      const response = await unassignTagsFromCompany(createdCompanyId, [createdTagId]);

      expect(response).toHaveProperty('id', createdCompanyId);
      expect(response).toHaveProperty('tags');
      expect(response.tags).not.toEqual(expect.arrayContaining([expect.objectContaining({ id: createdTagId })]));
    });

    it('should return 404 for non-existent company', async () => {
      await expect(assignTagsToCompany(99_999, [createdTagId])).rejects.toThrow();
    });
  });

  describe('Filter Companies by Tags', () => {
    it('should filter companies by tags', async () => {
      // Create additional companies and tags for filtering
      const secondCompany = await createCompany({
        ...companyFixtures.validCompany,
        email: '123@test.com',
        name: 'Second Company',
      });
      const thirdCompany = await createCompany({
        ...companyFixtures.validCompany,
        email: '456@test.com',
        name: 'Third Company',
      });
      const secondTag = await createTag({ ...tagFixtures.validTag, name: 'Prospect' });

      // Assign tags to companies
      await assignTagsToCompany(createdCompanyId, [createdTagId]); // First company gets first tag
      await assignTagsToCompany(secondCompany.id, [secondTag.id]); // Second company gets second tag
      await assignTagsToCompany(thirdCompany.id, [createdTagId, secondTag.id]); // Third company gets both tags

      // Test filtering by first tag
      const firstTagFilter = await getAllCompanies({ page: 1, size: 50, tagIds: [createdTagId] });
      expect(firstTagFilter).toHaveLength(2); // First and third companies
      expect(firstTagFilter.map(c => c.id)).toEqual(expect.arrayContaining([createdCompanyId, thirdCompany.id]));

      // Test filtering by second tag
      const secondTagFilter = await getAllCompanies({ page: 1, size: 50, tagIds: [secondTag.id] });
      expect(secondTagFilter).toHaveLength(2); // Second and third companies
      expect(secondTagFilter.map(c => c.id)).toEqual(expect.arrayContaining([secondCompany.id, thirdCompany.id]));

      // Test filtering by both tags (should return only third company)
      const bothTagsFilter = await getAllCompanies({ page: 1, size: 50, tagIds: [createdTagId, secondTag.id] });
      expect(bothTagsFilter).toHaveLength(1); // Only third company
      expect(bothTagsFilter[0].id).toBe(thirdCompany.id);

      // Test filtering by non-existent tag
      const nonExistentTagFilter = await getAllCompanies({ page: 1, size: 50, tagIds: [99_999] });
      expect(nonExistentTagFilter).toHaveLength(0);
    });
  });

  describe('Tag Assignment to Contacts', () => {
    it('should assign tags to a contact', async () => {
      const response = await assignTagsToContact(createdContactId, [createdTagId]);

      expect(response).toHaveProperty('id', createdContactId);
      expect(response).toHaveProperty('tags');
      expect(response.tags).toEqual(expect.arrayContaining([expect.objectContaining({ id: createdTagId })]));
    });

    it('should unassign tags from a contact', async () => {
      const response = await unassignTagsFromContact(createdContactId, [createdTagId]);

      expect(response).toHaveProperty('id', createdContactId);
      expect(response).toHaveProperty('tags');
      expect(response.tags).not.toEqual(expect.arrayContaining([expect.objectContaining({ id: createdTagId })]));
    });

    it('should return 404 for non-existent contact', async () => {
      await expect(assignTagsToContact(99_999, [createdTagId])).rejects.toThrow();
    });
  });

  describe('DELETE /tags/:id', () => {
    it('should delete a tag', async () => {
      const response = await deleteTag(createdTagId);

      expect(response).toHaveProperty('success', true);
      expect(response).toHaveProperty('message');
    });

    it('should return 404 for non-existent tag', async () => {
      await expect(deleteTag(99_999)).rejects.toThrow();
    });
  });
});
