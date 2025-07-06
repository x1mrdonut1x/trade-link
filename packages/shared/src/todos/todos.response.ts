import type { CompanyDto } from '../company';
import type { ContactDto } from '../contact';
import type { UserMinimalDto } from '../notes';

export interface TodoDto {
  id: number;
  title: string;
  description?: string | null;
  reminderDate: Date;
  resolved: boolean;
  contactId?: number | null;
  companyId?: number | null;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

export type TodoWithRelationsDto = TodoDto & {
  contact?: ContactDto | null;
  company?: CompanyDto | null;
  user?: UserMinimalDto | null;
};

export type GetTodoResponse = TodoWithRelationsDto;

export type GetAllTodosResponse = TodoWithRelationsDto[];

export type CreateTodoResponse = TodoWithRelationsDto;

export type UpdateTodoResponse = TodoWithRelationsDto;

export type DeleteTodoResponse = {
  id: number;
};
