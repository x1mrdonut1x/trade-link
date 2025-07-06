import { authRequest } from '../request.helper';

export interface TodoData {
  title: string;
  description?: string;
  reminderDate: Date;
  resolved?: boolean;
  contactId?: number;
  companyId?: number;
}

export const todosHelper = {
  async create(data: TodoData) {
    return await authRequest().post('/todos', data);
  },

  async getAll(params?: { status?: 'pending' | 'resolved' | 'upcoming'; contactId?: number; companyId?: number }) {
    const searchParams = new URLSearchParams();

    if (params?.status) {
      searchParams.append('status', params.status);
    }
    if (params?.contactId) {
      searchParams.append('contactId', params.contactId.toString());
    }
    if (params?.companyId) {
      searchParams.append('companyId', params.companyId.toString());
    }

    const queryString = searchParams.toString();
    const url = queryString ? `/todos?${queryString}` : '/todos';

    return await authRequest().get(url);
  },

  async getById(id: number) {
    return await authRequest().get(`/todos/${id}`);
  },

  async getByContactId(contactId: number) {
    return await authRequest().get(`/todos/contact/${contactId}`);
  },

  async getByCompanyId(companyId: number) {
    return await authRequest().get(`/todos/company/${companyId}`);
  },

  async getUpcoming() {
    return await this.getAll({ status: 'upcoming' });
  },

  async getResolved() {
    return await this.getAll({ status: 'resolved' });
  },

  async getPending() {
    return await this.getAll({ status: 'pending' });
  },

  async resolve(id: number) {
    return await authRequest().patch(`/todos/${id}/resolve`);
  },

  async unresolve(id: number) {
    return await authRequest().patch(`/todos/${id}/unresolve`);
  },

  async update(id: number, data: Partial<TodoData>) {
    return await authRequest().patch(`/todos/${id}`, data);
  },

  async delete(id: number) {
    return await authRequest().delete(`/todos/${id}`);
  },
};
