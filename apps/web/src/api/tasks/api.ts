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

export const tasksApi = {
  getAllTasks: (query?: GetAllTasksQueryDto) => {
    return myFetch<GetAllTasksResponse>('tasks', { query });
  },

  getTask: (id: number | string) => {
    return myFetch<GetTaskResponse>(`tasks/${id}`);
  },

  createTask: (data: CreateTaskRequest) => {
    return myFetch<CreateTaskResponse>('tasks', { method: 'POST', body: data });
  },

  updateTask: (id: number | string, data: UpdateTaskRequest) => {
    return myFetch<UpdateTaskResponse>(`tasks/${id}`, { method: 'PATCH', body: data });
  },

  deleteTask: (id: number | string) => {
    return myFetch<DeleteTaskResponse>(`tasks/${id}`, { method: 'DELETE' });
  },

  resolveTask: (id: number | string) => {
    return myFetch<UpdateTaskResponse>(`tasks/${id}/resolve`, { method: 'PATCH' });
  },

  unresolveTask: (id: number | string) => {
    return myFetch<UpdateTaskResponse>(`tasks/${id}/unresolve`, { method: 'PATCH' });
  },

  getTasksByContactId: (contactId: number | string) => {
    return myFetch<GetAllTasksResponse>(`tasks/contact/${contactId}`);
  },

  getTasksByCompanyId: (companyId: number | string) => {
    return myFetch<GetAllTasksResponse>(`tasks/company/${companyId}`);
  },
};
