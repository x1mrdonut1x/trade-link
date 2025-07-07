import type { CompanyDto } from '../company';
import type { ContactDto } from '../contact';
import type { UserMinimalDto } from '../notes';

export interface TaskDto {
  id: number;
  title: string;
  description?: string | null;
  reminderDate?: string | null;
  resolved: boolean;
  contactId?: number | null;
  companyId?: number | null;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export type TaskWithRelationsDto = TaskDto & {
  contact?: ContactDto | null;
  company?: CompanyDto | null;
  user?: UserMinimalDto | null;
};

export type GetTaskResponse = TaskWithRelationsDto;

export type GetAllTasksResponse = TaskWithRelationsDto[];

export type CreateTaskResponse = TaskWithRelationsDto;

export type UpdateTaskResponse = TaskWithRelationsDto;

export type DeleteTaskResponse = {
  id: number;
};
