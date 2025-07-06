import { myFetch } from '../client';

import type {
  CreateTodoRequest,
  CreateTodoResponse,
  DeleteTodoResponse,
  GetAllTodosQueryDto,
  GetAllTodosResponse,
  GetTodoResponse,
  UpdateTodoRequest,
  UpdateTodoResponse,
} from '@tradelink/shared';

export const todosApi = {
  getAllTodos: (query?: GetAllTodosQueryDto) => {
    return myFetch<GetAllTodosResponse>('todos', { query });
  },

  getTodo: (id: number | string) => {
    return myFetch<GetTodoResponse>(`todos/${id}`);
  },

  createTodo: (data: CreateTodoRequest) => {
    return myFetch<CreateTodoResponse>('todos', { method: 'POST', body: data });
  },

  updateTodo: (id: number | string, data: UpdateTodoRequest) => {
    return myFetch<UpdateTodoResponse>(`todos/${id}`, { method: 'PATCH', body: data });
  },

  deleteTodo: (id: number | string) => {
    return myFetch<DeleteTodoResponse>(`todos/${id}`, { method: 'DELETE' });
  },

  resolveTodo: (id: number | string) => {
    return myFetch<UpdateTodoResponse>(`todos/${id}/resolve`, { method: 'PATCH' });
  },

  unresolveTodo: (id: number | string) => {
    return myFetch<UpdateTodoResponse>(`todos/${id}/unresolve`, { method: 'PATCH' });
  },

  getTodosByContactId: (contactId: number | string) => {
    return myFetch<GetAllTodosResponse>(`todos/contact/${contactId}`);
  },

  getTodosByCompanyId: (companyId: number | string) => {
    return myFetch<GetAllTodosResponse>(`todos/company/${companyId}`);
  },
};
