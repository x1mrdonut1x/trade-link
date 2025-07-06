import { createAuthenticatedUser, getProfile } from '../../helpers/auth/auth.helper';
import { createCompany } from '../../helpers/company/company.helper';
import { createContact } from '../../helpers/contact/contact.helper';
import { todosHelper } from '../../helpers/todos/todos.helper';
import { resetDatabase, setTestAuthToken } from '../../setupFilesAfterEnv';

describe('Todos Module', () => {
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

  describe('POST /todos', () => {
    it('should create a todo', async () => {
      const todoData = {
        title: 'Test Todo',
        description: 'This is a test todo',
        reminderDate: new Date('2025-12-31'),
      };

      const response = await todosHelper.create(todoData);

      expect(response).toBeDefined();
      expect(response.id).toBeDefined();
      expect(response.title).toBe(todoData.title);
      expect(response.description).toBe(todoData.description);
      expect(new Date(response.reminderDate)).toEqual(todoData.reminderDate);
      expect(response.createdBy).toBe(userId);
      expect(response.createdAt).toBeDefined();
      expect(response.updatedAt).toBeDefined();
      expect(response.resolved).toBe(false);
    });

    it('should create a todo with contact association', async () => {
      // First create a contact
      const contactResponse = await createContact({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      });

      const todoData = {
        title: 'Contact Todo',
        description: 'Todo associated with a contact',
        reminderDate: new Date('2025-12-31'),
        contactId: contactResponse.id,
      };

      const response = await todosHelper.create(todoData);

      expect(response).toBeDefined();
      expect(response.contactId).toBe(contactResponse.id);
      expect(response.contact).toBeDefined();
      expect(response.contact.id).toBe(contactResponse.id);
    });

    it('should create a todo with company association', async () => {
      // First create a company
      const companyResponse = await createCompany({
        name: 'Test Company',
        email: 'test@company.com',
      });

      const todoData = {
        title: 'Company Todo',
        description: 'Todo associated with a company',
        reminderDate: new Date('2025-12-31'),
        companyId: companyResponse.id,
      };

      const response = await todosHelper.create(todoData);

      expect(response).toBeDefined();
      expect(response.companyId).toBe(companyResponse.id);
      expect(response.company).toBeDefined();
      expect(response.company.id).toBe(companyResponse.id);
    });
  });

  describe('GET /todos', () => {
    it('should get all todos', async () => {
      const response = await todosHelper.getAll();

      expect(response).toBeDefined();
      expect(Array.isArray(response)).toBe(true);
    });

    it('should get todos by status', async () => {
      // Create a resolved item
      await todosHelper.create({
        title: 'Resolved Todo',
        description: 'This is a resolved todo',
        reminderDate: new Date('2025-12-31'),
        resolved: true,
      });

      // Create a pending item
      await todosHelper.create({
        title: 'Pending Todo',
        description: 'This is a pending todo',
        reminderDate: new Date('2025-12-31'),
        resolved: false,
      });

      const resolvedResponse = await todosHelper.getAll({ status: 'resolved' });
      const pendingResponse = await todosHelper.getAll({ status: 'pending' });

      expect(resolvedResponse).toBeDefined();
      expect(Array.isArray(resolvedResponse)).toBe(true);
      expect(resolvedResponse.every(todo => todo.resolved === true)).toBe(true);

      expect(pendingResponse).toBeDefined();
      expect(Array.isArray(pendingResponse)).toBe(true);
      expect(pendingResponse.every(todo => todo.resolved === false)).toBe(true);
    });

    it('should get todos by contact id', async () => {
      // Create a contact
      const contactResponse = await createContact({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      });

      // Create an item for the contact
      await todosHelper.create({
        title: 'Contact Todo',
        description: 'Todo for specific contact',
        reminderDate: new Date('2025-12-31'),
        contactId: contactResponse.id,
      });

      const response = await todosHelper.getAll({ contactId: contactResponse.id });

      expect(response).toBeDefined();
      expect(Array.isArray(response)).toBe(true);
      expect(response.every(todo => todo.contactId === contactResponse.id)).toBe(true);
    });

    it('should get todos by company id', async () => {
      // Create a company
      const companyResponse = await createCompany({
        name: 'Test Company',
        email: 'test@company.com',
      });

      // Create an item for the company
      await todosHelper.create({
        title: 'Company Todo',
        description: 'Todo for specific company',
        reminderDate: new Date('2025-12-31'),
        companyId: companyResponse.id,
      });

      const response = await todosHelper.getAll({ companyId: companyResponse.id });

      expect(response).toBeDefined();
      expect(Array.isArray(response)).toBe(true);
      expect(response.every(todo => todo.companyId === companyResponse.id)).toBe(true);
    });

    describe('GET /todos/upcoming', () => {
      it('should get upcoming todos', async () => {
        const response = await todosHelper.getUpcoming();

        expect(response).toBeDefined();
        expect(Array.isArray(response)).toBe(true);
      });
    });

    describe('GET /todos/:id', () => {
      it('should get a todo by id', async () => {
        // First create a todo
        const todoData = {
          title: 'Test Todo for Get',
          description: 'This is a test todo for get operation',
          reminderDate: new Date('2025-12-31'),
        };

        const createdTodo = await todosHelper.create(todoData);
        const response = await todosHelper.getById(createdTodo.id);

        expect(response).toBeDefined();
        expect(response.id).toBe(createdTodo.id);
        expect(response.title).toBe(todoData.title);
      });
    });

    describe('PATCH /todos/:id', () => {
      it('should update a todo', async () => {
        // First create a todo
        const todoData = {
          title: 'Test Todo for Update',
          description: 'This is a test todo for update operation',
          reminderDate: new Date('2025-12-31'),
        };

        const createdTodo = await todosHelper.create(todoData);

        const updateData = {
          title: 'Updated Todo Title',
          description: 'Updated description',
        };

        const response = await todosHelper.update(createdTodo.id, updateData);

        expect(response).toBeDefined();
        expect(response.id).toBe(createdTodo.id);
        expect(response.title).toBe(updateData.title);
        expect(response.description).toBe(updateData.description);
      });
    });

    describe('DELETE /todos/:id', () => {
      it('should delete a todo', async () => {
        // First create a todo
        const todoData = {
          title: 'Test Todo for Delete',
          description: 'This is a test todo for delete operation',
          reminderDate: new Date('2025-12-31'),
        };

        const createdTodo = await todosHelper.create(todoData);
        const response = await todosHelper.delete(createdTodo.id);

        expect(response).toBeDefined();
        expect(response.id).toBe(createdTodo.id);
      });
    });

    describe('Resolved todos functionality', () => {
      it('should create a todo with resolved field', async () => {
        const todoData = {
          title: 'Test Resolved Todo',
          description: 'This is a test todo with resolved field',
          reminderDate: new Date('2025-12-31'),
          resolved: true,
        };

        const response = await todosHelper.create(todoData);

        expect(response).toBeDefined();
        expect(response.resolved).toBe(true);
      });

      it('should get resolved todos', async () => {
        // Create a resolved item first
        const resolvedTodoData = {
          title: 'Resolved Todo',
          description: 'This is a resolved todo',
          reminderDate: new Date('2025-12-31'),
          resolved: true,
        };

        await todosHelper.create(resolvedTodoData);

        const response = await todosHelper.getResolved();

        expect(response).toBeDefined();
        expect(Array.isArray(response)).toBe(true);
        expect(response.length).toBeGreaterThan(0);
        expect(response[0].resolved).toBe(true);
      });

      it('should get pending todos', async () => {
        // Create a pending item first
        const pendingTodoData = {
          title: 'Pending Todo',
          description: 'This is a pending todo',
          reminderDate: new Date('2025-12-31'),
          resolved: false,
        };

        await todosHelper.create(pendingTodoData);

        const response = await todosHelper.getPending();

        expect(response).toBeDefined();
        expect(Array.isArray(response)).toBe(true);
        expect(response.length).toBeGreaterThan(0);
        expect(response[0].resolved).toBe(false);
      });

      it('should resolve a todo', async () => {
        // Create a pending item first
        const todoData = {
          title: 'Todo to Resolve',
          description: 'This todo will be resolved',
          reminderDate: new Date('2025-12-31'),
          resolved: false,
        };

        const createdTodo = await todosHelper.create(todoData);
        const response = await todosHelper.resolve(createdTodo.id);

        expect(response).toBeDefined();
        expect(response.id).toBe(createdTodo.id);
        expect(response.resolved).toBe(true);
      });

      it('should unresolve a todo', async () => {
        // Create a resolved item first
        const todoData = {
          title: 'Todo to Unresolve',
          description: 'This todo will be unresolved',
          reminderDate: new Date('2025-12-31'),
          resolved: true,
        };

        const createdTodo = await todosHelper.create(todoData);
        const response = await todosHelper.unresolve(createdTodo.id);

        expect(response).toBeDefined();
        expect(response.id).toBe(createdTodo.id);
        expect(response.resolved).toBe(false);
      });

      it('should update a todo with resolved field', async () => {
        // Create a pending item first
        const todoData = {
          title: 'Todo for Update',
          description: 'This todo will be updated',
          reminderDate: new Date('2025-12-31'),
          resolved: false,
        };

        const createdTodo = await todosHelper.create(todoData);

        const updateData = {
          resolved: true,
        };

        const response = await todosHelper.update(createdTodo.id, updateData);

        expect(response).toBeDefined();
        expect(response.id).toBe(createdTodo.id);
        expect(response.resolved).toBe(true);
      });

      it('should exclude resolved todos from upcoming', async () => {
        // Create a resolved item with upcoming reminder date first
        const resolvedTodoData = {
          title: 'Resolved Upcoming Todo',
          description: 'This resolved todo should not appear in upcoming',
          reminderDate: new Date('2025-07-10'), // within next week
          resolved: true,
        };

        await todosHelper.create(resolvedTodoData);

        const upcomingResponse = await todosHelper.getUpcoming();

        expect(upcomingResponse).toBeDefined();
        expect(Array.isArray(upcomingResponse)).toBe(true);

        // Check that no resolved todos appear in upcoming
        const resolvedInUpcoming = upcomingResponse.filter(todo => todo.resolved === true);
        expect(resolvedInUpcoming.length).toBe(0);
      });
    });
  });
});
