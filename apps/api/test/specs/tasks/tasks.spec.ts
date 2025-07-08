import { getProfile, initClient } from '../../helpers/auth/auth.helper';
import { createCompany } from '../../helpers/company/company.helper';
import { createContact } from '../../helpers/contact/contact.helper';
import { tasksHelper } from '../../helpers/tasks/tasks.helper';
import { resetDatabase } from '../../setupFilesAfterEnv';

describe('Tasks Module', () => {
  let authToken: string;
  let userId: number;

  beforeEach(async () => {
    await resetDatabase();
    await initClient();

    // Get user profile to get the userId
    const profile = await getProfile();
    userId = profile.id;
  });

  describe('POST /tasks', () => {
    it('should create a task', async () => {
      const response = await tasksHelper.create(tasksHelper.fixtures.create);

      expect(response).toBeDefined();
      expect(response.id).toBeDefined();
      expect(response.title).toBe(tasksHelper.fixtures.create.title);
      expect(response.description).toBe(tasksHelper.fixtures.create.description);
      expect(response.createdBy).toBe(userId);
      expect(response.createdAt).toBeDefined();
      expect(response.updatedAt).toBeDefined();
      expect(response.resolved).toBe(false);
    });

    it('should create a task with contact association', async () => {
      // First create a contact
      const contactResponse = await createContact({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      });

      const response = await tasksHelper.create({ ...tasksHelper.fixtures.create, contactId: contactResponse.id });

      expect(response).toBeDefined();
      expect(response.contactId).toBe(contactResponse.id);
      expect(response.contact).toBeDefined();
      expect(response.contact?.id).toBe(contactResponse.id);
    });

    it('should create a task with company association', async () => {
      // First create a company
      const companyResponse = await createCompany({
        name: 'Test Company',
        email: 'test@company.com',
      });

      const response = await tasksHelper.create({ ...tasksHelper.fixtures.create, companyId: companyResponse.id });

      expect(response).toBeDefined();
      expect(response.companyId).toBe(companyResponse.id);
      expect(response.company).toBeDefined();
      expect(response.company?.id).toBe(companyResponse.id);
    });
  });

  describe('GET /tasks', () => {
    it('should get all tasks', async () => {
      const response = await tasksHelper.getAll();

      expect(response).toBeDefined();
      expect(Array.isArray(response)).toBe(true);
    });

    it('should get tasks by status', async () => {
      // Create a resolved item
      await tasksHelper.create({
        title: 'Resolved Task',
        description: 'This is a resolved task',
        reminderDate: '2025-12-31',
        resolved: true,
      });

      // Create a pending item
      await tasksHelper.create({
        title: 'Pending Task',
        description: 'This is a pending task',
        reminderDate: '2025-12-31',
        resolved: false,
      });

      const resolvedResponse = await tasksHelper.getAll({ status: 'resolved' });
      const pendingResponse = await tasksHelper.getAll({ status: 'pending' });

      expect(resolvedResponse).toBeDefined();
      expect(Array.isArray(resolvedResponse)).toBe(true);
      expect(resolvedResponse.every(task => task.resolved === true)).toBe(true);

      expect(pendingResponse).toBeDefined();
      expect(Array.isArray(pendingResponse)).toBe(true);
      expect(pendingResponse.every(task => task.resolved === false)).toBe(true);
    });

    it('should get tasks by contact id', async () => {
      // Create a contact
      const contactResponse = await createContact({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      });

      // Create an item for the contact
      await tasksHelper.create({
        title: 'Contact Task',
        description: 'Task for specific contact',
        reminderDate: '2025-12-31',
        contactId: contactResponse.id,
      });

      const response = await tasksHelper.getAll({ contactId: contactResponse.id });

      expect(response).toBeDefined();
      expect(Array.isArray(response)).toBe(true);
      expect(response.every(task => task.contactId === contactResponse.id)).toBe(true);
    });

    it('should get tasks by company id', async () => {
      // Create a company
      const companyResponse = await createCompany({
        name: 'Test Company',
        email: 'test@company.com',
      });

      // Create an item for the company
      await tasksHelper.create({
        title: 'Company Task',
        description: 'Task for specific company',
        reminderDate: '2025-12-31',
        companyId: companyResponse.id,
      });

      const response = await tasksHelper.getAll({ companyId: companyResponse.id });

      expect(response).toBeDefined();
      expect(Array.isArray(response)).toBe(true);
      expect(response.every(task => task.companyId === companyResponse.id)).toBe(true);
    });

    describe('GET /tasks/upcoming', () => {
      it('should get upcoming tasks', async () => {
        const response = await tasksHelper.getUpcoming();

        expect(response).toBeDefined();
        expect(Array.isArray(response)).toBe(true);
      });
    });

    describe('GET /tasks/:id', () => {
      it('should get a task by id', async () => {
        const createdTask = await tasksHelper.create(tasksHelper.fixtures.create);
        const response = await tasksHelper.getById(createdTask.id);

        expect(response).toBeDefined();
        expect(response.id).toBe(createdTask.id);
        expect(response.title).toBe(tasksHelper.fixtures.create.title);
      });
    });

    describe('PATCH /tasks/:id', () => {
      it('should update a task', async () => {
        const createdTask = await tasksHelper.create(tasksHelper.fixtures.create);

        const updateData = {
          title: 'Updated Task Title',
          description: 'Updated description',
        };

        const response = await tasksHelper.update(createdTask.id, updateData);

        expect(response).toBeDefined();
        expect(response.id).toBe(createdTask.id);
        expect(response.title).toBe(updateData.title);
        expect(response.description).toBe(updateData.description);
      });
    });

    describe('DELETE /tasks/:id', () => {
      it('should delete a task', async () => {
        const createdTask = await tasksHelper.create(tasksHelper.fixtures.create);
        const response = await tasksHelper.delete(createdTask.id);

        expect(response).toBeDefined();
        expect(response.id).toBe(createdTask.id);
      });
    });

    describe('Resolved tasks functionality', () => {
      it('should create a task with resolved field', async () => {
        const response = await tasksHelper.create({ ...tasksHelper.fixtures.create, resolved: true });

        expect(response).toBeDefined();
        expect(response.resolved).toBe(true);
      });

      it('should get resolved tasks', async () => {
        // Create a resolved item first
        const resolvedTaskData = {
          title: 'Resolved Task',
          description: 'This is a resolved task',
          reminderDate: '2025-12-31',
          resolved: true,
        };

        await tasksHelper.create(resolvedTaskData);

        const response = await tasksHelper.getResolved();

        expect(response).toBeDefined();
        expect(Array.isArray(response)).toBe(true);
        expect(response.length).toBeGreaterThan(0);
        expect(response[0].resolved).toBe(true);
      });

      it('should get pending tasks', async () => {
        await tasksHelper.create(tasksHelper.fixtures.create);

        const response = await tasksHelper.getPending();

        expect(response).toBeDefined();
        expect(Array.isArray(response)).toBe(true);
        expect(response.length).toBeGreaterThan(0);
        expect(response[0].resolved).toBe(false);
      });

      it('should resolve a task', async () => {
        const createdTask = await tasksHelper.create(tasksHelper.fixtures.create);
        const response = await tasksHelper.resolve(createdTask.id);

        expect(response).toBeDefined();
        expect(response.id).toBe(createdTask.id);
        expect(response.resolved).toBe(true);
      });

      it('should unresolve a task', async () => {
        const createdTask = await tasksHelper.create({ ...tasksHelper.fixtures.create, resolved: true });
        const response = await tasksHelper.unresolve(createdTask.id);

        expect(response).toBeDefined();
        expect(response.id).toBe(createdTask.id);
        expect(response.resolved).toBe(false);
      });

      it('should update a task with resolved field', async () => {
        const createdTask = await tasksHelper.create(tasksHelper.fixtures.create);

        const updateData = {
          resolved: true,
        };

        const response = await tasksHelper.update(createdTask.id, updateData);

        expect(response).toBeDefined();
        expect(response.id).toBe(createdTask.id);
        expect(response.resolved).toBe(true);
      });

      it('should exclude resolved tasks from upcoming', async () => {
        // Create a resolved item with upcoming reminder date first
        const resolvedTaskData = {
          title: 'Resolved Upcoming Task',
          description: 'This resolved task should not appear in upcoming',
          reminderDate: '2025-07-10', // within next week
          resolved: true,
        };

        await tasksHelper.create(resolvedTaskData);

        const upcomingResponse = await tasksHelper.getUpcoming();

        expect(upcomingResponse).toBeDefined();
        expect(Array.isArray(upcomingResponse)).toBe(true);

        // Check that no resolved tasks appear in upcoming
        const resolvedInUpcoming = upcomingResponse.filter(task => task.resolved === true);
        expect(resolvedInUpcoming.length).toBe(0);
      });
    });
  });
});
