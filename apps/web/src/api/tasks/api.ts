import { myFetch } from '../client';

import type {
  CreateTaskRequest,
  CreateTaskResponse,
  DeleteTaskResponse,
  GetAllTasksQueryDto,
  GetAllTasksResponse,
  GetTaskResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
} from '@tradelink/shared';

export const tasksApi = (tenantId: string) => ({
  getAllTasks: (query?: GetAllTasksQueryDto) => {
    return myFetch<GetAllTasksResponse>(tenantId, 'tasks', { query });
  },

  getTask: (id: number | string) => {
    return myFetch<GetTaskResponse>(tenantId, `tasks/${id}`);
  },

  createTask: (data: CreateTaskRequest) => {
    return myFetch<CreateTaskResponse>(tenantId, 'tasks', { method: 'POST', body: data });
  },

  updateTask: (id: number | string, data: UpdateTaskRequest) => {
    return myFetch<UpdateTaskResponse>(tenantId, `tasks/${id}`, { method: 'PATCH', body: data });
  },

  deleteTask: (id: number | string) => {
    return myFetch<DeleteTaskResponse>(tenantId, `tasks/${id}`, { method: 'DELETE' });
  },

  resolveTask: (id: number | string) => {
    return myFetch<UpdateTaskResponse>(tenantId, `tasks/${id}/resolve`, { method: 'PATCH' });
  },

  unresolveTask: (id: number | string) => {
    return myFetch<UpdateTaskResponse>(tenantId, `tasks/${id}/unresolve`, { method: 'PATCH' });
  },

  getTasksByContactId: (contactId: number | string) => {
    return myFetch<GetAllTasksResponse>(tenantId, `tasks/contact/${contactId}`);
  },

  getTasksByCompanyId: (companyId: number | string) => {
    return myFetch<GetAllTasksResponse>(tenantId, `tasks/company/${companyId}`);
  },
});
