import {
  CreateTaskResponse,
  GetAllTasksResponse,
  GetTaskResponse,
  type CreateTaskRequest,
  type DeleteTaskResponse,
  type GetAllTasksQueryRequest,
  type UpdateTaskRequest,
  type UpdateTaskResponse,
} from '@tradelink/shared';
import { authRequest } from '../request.helper';

export const tasksHelper = {
  fixtures: {
    create: {
      title: 'Test Task',
      description: 'This is a test task',
      reminderDate: '2025-12-31',
    },
  },
  async create(data: CreateTaskRequest) {
    return authRequest().post<CreateTaskResponse>('/tasks', data);
  },

  async getAll(query?: GetAllTasksQueryRequest) {
    return authRequest().get<GetAllTasksResponse>('/tasks', query);
  },

  async getById(id: number) {
    return authRequest().get<GetTaskResponse>(`/tasks/${id}`);
  },

  async getByContactId(contactId: number) {
    return authRequest().get<GetAllTasksResponse>(`/tasks/contact/${contactId}`);
  },

  async getByCompanyId(companyId: number) {
    return authRequest().get<GetAllTasksResponse>(`/tasks/company/${companyId}`);
  },

  async getUpcoming() {
    return this.getAll({ status: 'upcoming' });
  },

  async getResolved() {
    return this.getAll({ status: 'resolved' });
  },

  async getPending() {
    return this.getAll({ status: 'pending' });
  },

  async resolve(id: number) {
    return authRequest().patch<UpdateTaskResponse>(`/tasks/${id}/resolve`);
  },

  async unresolve(id: number) {
    return authRequest().patch<UpdateTaskResponse>(`/tasks/${id}/unresolve`);
  },

  async update(id: number, data: UpdateTaskRequest) {
    return authRequest().patch<UpdateTaskResponse>(`/tasks/${id}`, data);
  },

  async delete(id: number) {
    return authRequest().delete<DeleteTaskResponse>(`/tasks/${id}`);
  },
};
