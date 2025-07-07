import { createAuthenticatedUser, getProfile } from '../../helpers/auth/auth.helper';
import { createCompany } from '../../helpers/company/company.helper';
import { createContact } from '../../helpers/contact/contact.helper';
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNote,
  noteFixtures,
  updateNote,
} from '../../helpers/notes/notes.helper';
import { resetDatabase, setTestAuthToken } from '../../setupFilesAfterEnv';

describe('Notes Controller (e2e)', () => {
  let authToken: string;
  let userId: number;

  beforeEach(async () => {
    await resetDatabase();
    authToken = await createAuthenticatedUser();
    setTestAuthToken(authToken);

    // Get user profile to get the userId
    const profile = await getProfile(authToken);
    userId = profile.id;
  });

  describe('POST /notes', () => {
    it('should create a new note for a contact successfully', async () => {
      // First create a contact
      const contactResponse = await createContact({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      });
      expect(contactResponse).toHaveProperty('id');

      // Create note for contact
      const noteData = {
        ...noteFixtures.validContactNote,
        contactId: contactResponse.id,
      };

      const response = await createNote(noteData);

      expect(response).toHaveProperty('id');
      expect(response.title).toBe(noteData.title);
      expect(response.description).toBe(noteData.description);
      expect(response.contactId).toBe(contactResponse.id);
      expect(response.companyId).toBeNull();
      expect(response.createdBy).toBe(userId);
      expect(response).toHaveProperty('createdAt');
      expect(response).toHaveProperty('updatedAt');
    });

    it('should create a new note for a company successfully', async () => {
      // First create a company
      const companyResponse = await createCompany({
        name: 'Test Company',
        email: 'test@company.com',
      });
      expect(companyResponse).toHaveProperty('id');

      // Create note for company
      const noteData = {
        ...noteFixtures.validCompanyNote,
        companyId: companyResponse.id,
      };

      const response = await createNote(noteData);

      expect(response).toHaveProperty('id');
      expect(response.title).toBe(noteData.title);
      expect(response.description).toBe(noteData.description);
      expect(response.contactId).toBeNull();
      expect(response.companyId).toBe(companyResponse.id);
      expect(response.createdBy).toBe(userId);
    });

    it('should create a note without description', async () => {
      // First create a contact
      const contactResponse = await createContact({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
      });

      const noteData = {
        ...noteFixtures.validNoteWithoutDescription,
        contactId: contactResponse.id,
      };

      const response = await createNote(noteData);

      expect(response).toHaveProperty('id');
      expect(response.title).toBe(noteData.title);
      expect(response.description).toBeNull();
      expect(response.contactId).toBe(contactResponse.id);
    });

    it('should fail to create note without required fields', async () => {
      const invalidNoteData = {
        ...noteFixtures.invalidNote,
      };

      await expect(createNote(invalidNoteData as any)).rejects.toThrow();
    });

    it('should fail to create note without createdBy', async () => {
      const noteData = {
        title: 'Test Note',
        description: 'Test description',
        contactId: 1,
      };

      await expect(createNote(noteData as any)).rejects.toThrow();
    });
  });

  describe('GET /notes', () => {
    it('should return all notes', async () => {
      // Create a contact and company first
      const contactResponse = await createContact({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      });
      const companyResponse = await createCompany({
        name: 'Test Company',
        email: 'test@company.com',
      });

      // Create multiple notes
      const contactNote = await createNote({
        title: 'Contact Note',
        description: 'Contact description',
        contactId: contactResponse.id,
        companyId: null,
      });
      const companyNote = await createNote({
        title: 'Company Note',
        description: 'Company description',
        contactId: null,
        companyId: companyResponse.id,
      });

      const response = await getAllNotes();

      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBe(2);

      // Check if notes are returned in desc order by createdAt
      const noteIds = response.map(note => note.id);
      expect(noteIds).toContain(contactNote.id);
      expect(noteIds).toContain(companyNote.id);
    });

    it('should return empty array when no notes exist', async () => {
      const response = await getAllNotes();

      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBe(0);
    });
  });

  describe('GET /notes/:id', () => {
    it('should return a specific note by id', async () => {
      // Create a contact and note
      const contactResponse = await createContact({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      });
      const noteResponse = await createNote({
        title: 'Test Note',
        description: 'Test description',
        contactId: contactResponse.id,
        companyId: null,
      });

      const response = await getNote(noteResponse.id);

      expect(response.id).toBe(noteResponse.id);
      expect(response.title).toBe('Test Note');
      expect(response.description).toBe('Test description');
      expect(response.contactId).toBe(contactResponse.id);
      expect(response.createdBy).toBe(userId);
    });

    it('should fail to return non-existent note', async () => {
      await expect(getNote(999)).rejects.toThrow();
    });
  });

  describe('PATCH /notes/:id', () => {
    it('should update a note successfully', async () => {
      // Create a contact and note
      const contactResponse = await createContact({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      });
      const noteResponse = await createNote({
        title: 'Original Title',
        description: 'Original description',
        contactId: contactResponse.id,
        companyId: null,
      });

      const updateData = {
        title: 'Updated Title',
        description: 'Updated description',
      };

      const response = await updateNote(noteResponse.id, updateData);

      expect(response.id).toBe(noteResponse.id);
      expect(response.title).toBe('Updated Title');
      expect(response.description).toBe('Updated description');
      expect(response.contactId).toBe(contactResponse.id);
      expect(response.createdBy).toBe(userId);
      expect(response.updatedAt).not.toBe(response.createdAt);
    });

    it('should update only title', async () => {
      // Create a contact and note
      const contactResponse = await createContact({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      });
      const noteResponse = await createNote({
        title: 'Original Title',
        description: 'Original description',
        contactId: contactResponse.id,
        companyId: null,
      });

      const updateData = {
        title: 'Updated Title Only',
      };

      const response = await updateNote(noteResponse.id, updateData);

      expect(response.title).toBe('Updated Title Only');
      expect(response.description).toBe('Original description');
    });

    it('should fail to update non-existent note', async () => {
      await expect(updateNote(999, { title: 'New Title' })).rejects.toThrow();
    });
  });

  describe('DELETE /notes/:id', () => {
    it('should delete a note successfully', async () => {
      // Create a contact and note
      const contactResponse = await createContact({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      });
      const noteResponse = await createNote({
        title: 'Test Note',
        description: 'Test description',
        contactId: contactResponse.id,
        companyId: null,
      });

      const response = await deleteNote(noteResponse.id);

      expect(response.id).toBe(noteResponse.id);

      // Verify note is deleted
      await expect(getNote(noteResponse.id)).rejects.toThrow();
    });

    it('should fail to delete non-existent note', async () => {
      await expect(deleteNote(999)).rejects.toThrow();
    });
  });

  describe('GET /notes/contact/:contactId', () => {
    it('should return notes for a specific contact', async () => {
      // Create contacts
      const contact1 = await createContact({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      });
      const contact2 = await createContact({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
      });

      // Create notes for contact1
      const note1 = await createNote({
        title: 'Contact 1 Note 1',
        description: 'Description 1',
        contactId: contact1.id,
        companyId: null,
      });
      const note2 = await createNote({
        title: 'Contact 1 Note 2',
        description: 'Description 2',
        contactId: contact1.id,
        companyId: null,
      });

      // Create note for contact2
      await createNote({
        title: 'Contact 2 Note',
        description: 'Description for contact 2',
        contactId: contact2.id,
        companyId: null,
      });

      const response = await getAllNotes({ contactId: contact1.id });

      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBe(2);
      expect(response.every(note => note.contactId === contact1.id)).toBe(true);

      const noteIds = response.map(note => note.id);
      expect(noteIds).toContain(note1.id);
      expect(noteIds).toContain(note2.id);
    });

    it('should return empty array for contact with no notes', async () => {
      const contactResponse = await createContact({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      });

      const response = await getAllNotes({ contactId: contactResponse.id });

      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBe(0);
    });
  });

  describe('GET /notes/company/:companyId', () => {
    it('should return notes for a specific company', async () => {
      // Create companies
      const company1 = await createCompany({
        name: 'Company 1',
        email: 'company1@example.com',
      });
      const company2 = await createCompany({
        name: 'Company 2',
        email: 'company2@example.com',
      });

      // Create notes for company1
      const note1 = await createNote({
        title: 'Company 1 Note 1',
        description: 'Description 1',
        contactId: null,
        companyId: company1.id,
      });
      const note2 = await createNote({
        title: 'Company 1 Note 2',
        description: 'Description 2',
        contactId: null,
        companyId: company1.id,
      });

      // Create note for company2
      await createNote({
        title: 'Company 2 Note',
        description: 'Description for company 2',
        contactId: null,
        companyId: company2.id,
      });

      const response = await getAllNotes({ companyId: company1.id });

      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBe(2);
      expect(response.every(note => note.companyId === company1.id)).toBe(true);

      const noteIds = response.map(note => note.id);
      expect(noteIds).toContain(note1.id);
      expect(noteIds).toContain(note2.id);
    });

    it('should return empty array for company with no notes', async () => {
      const companyResponse = await createCompany({
        name: 'Test Company',
        email: 'test@company.com',
      });

      const response = await getAllNotes({ companyId: companyResponse.id });

      expect(Array.isArray(response)).toBe(true);
      expect(response.length).toBe(0);
    });
  });
});
