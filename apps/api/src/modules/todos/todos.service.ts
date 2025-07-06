import { Injectable } from '@nestjs/common';
import type {
  CreateTodoRequest,
  CreateTodoResponse,
  DeleteTodoResponse,
  GetAllTodosResponse,
  GetTodoResponse,
  UpdateTodoRequest,
  UpdateTodoResponse,
} from '@tradelink/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async createTodo(data: CreateTodoRequest & { createdBy: number }): Promise<CreateTodoResponse> {
    const todo = await this.prisma.todo.create({
      data,
      include: {
        contact: true,
        company: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return todo;
  }

  async getAllTodos(filters?: {
    status?: 'pending' | 'resolved' | 'upcoming';
    contactId?: number;
    companyId?: number;
  }): Promise<GetAllTodosResponse> {
    const where: any = {};

    if (filters?.status) {
      switch (filters.status) {
        case 'resolved': {
          where.resolved = true;
          break;
        }
        case 'pending': {
          where.resolved = false;
          break;
        }
        case 'upcoming': {
          const today = new Date();
          const nextWeek = new Date();
          nextWeek.setDate(today.getDate() + 7);

          where.resolved = false;
          where.reminderDate = {
            gte: today,
            lte: nextWeek,
          };
          break;
        }
      }
    }

    if (filters?.contactId) {
      where.contactId = filters.contactId;
    }

    if (filters?.companyId) {
      where.companyId = filters.companyId;
    }

    const todos = await this.prisma.todo.findMany({
      where,
      include: {
        contact: true,
        company: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        reminderDate: 'asc',
      },
    });

    return todos;
  }

  async getTodoById(id: number): Promise<GetTodoResponse> {
    const todo = await this.prisma.todo.findUniqueOrThrow({
      where: { id },
      include: {
        contact: true,
        company: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return todo;
  }

  async updateTodo(id: number, data: UpdateTodoRequest): Promise<UpdateTodoResponse> {
    const todo = await this.prisma.todo.update({
      where: { id },
      data,
      include: {
        contact: true,
        company: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return todo;
  }

  async deleteTodo(id: number): Promise<DeleteTodoResponse> {
    const todo = await this.prisma.todo.delete({
      where: { id },
    });

    return { id: todo.id };
  }

  async getTodosByContactId(contactId: number): Promise<GetAllTodosResponse> {
    const todos = await this.prisma.todo.findMany({
      where: { contactId },
      include: {
        contact: true,
        company: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        reminderDate: 'asc',
      },
    });

    return todos;
  }

  async getTodosByCompanyId(companyId: number): Promise<GetAllTodosResponse> {
    const todos = await this.prisma.todo.findMany({
      where: { companyId },
      include: {
        contact: true,
        company: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        reminderDate: 'asc',
      },
    });

    return todos;
  }

  async getUpcomingTodos(): Promise<GetAllTodosResponse> {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const todos = await this.prisma.todo.findMany({
      where: {
        resolved: false,
        reminderDate: {
          gte: today,
          lte: nextWeek,
        },
      },
      include: {
        contact: true,
        company: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        reminderDate: 'asc',
      },
    });

    return todos;
  }

  async getResolvedTodos(): Promise<GetAllTodosResponse> {
    const todos = await this.prisma.todo.findMany({
      where: {
        resolved: true,
      },
      include: {
        contact: true,
        company: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return todos;
  }

  async getPendingTodos(): Promise<GetAllTodosResponse> {
    const todos = await this.prisma.todo.findMany({
      where: {
        resolved: false,
      },
      include: {
        contact: true,
        company: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        reminderDate: 'asc',
      },
    });

    return todos;
  }

  async resolveTodo(id: number): Promise<UpdateTodoResponse> {
    const todo = await this.prisma.todo.update({
      where: { id },
      data: { resolved: true },
      include: {
        contact: true,
        company: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return todo;
  }

  async unresolveTodo(id: number): Promise<UpdateTodoResponse> {
    const todo = await this.prisma.todo.update({
      where: { id },
      data: { resolved: false },
      include: {
        contact: true,
        company: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return todo;
  }
}
