import { Injectable } from '@nestjs/common';
import type {
  CreateTaskRequest,
  CreateTaskResponse,
  DeleteTaskResponse,
  GetAllTasksResponse,
  GetTaskResponse,
  PrismaRawResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
} from '@tradelink/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(data: CreateTaskRequest & { createdBy: number }): Promise<PrismaRawResponse<CreateTaskResponse>> {
    const task = await this.prisma.task.create({
      data: {
        ...data,
        reminderDate: data.reminderDate ? new Date(data.reminderDate).toISOString() : data.reminderDate,
      },
      include: {
        contact: true,
        company: true,
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    return task;
  }

  async getAllTasks(filters?: {
    status?: 'pending' | 'resolved' | 'upcoming';
    contactId?: number;
    companyId?: number;
  }): Promise<PrismaRawResponse<GetAllTasksResponse>> {
    const where: any = {};

    switch (filters?.status) {
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

        where.resolved = false;
        where.reminderDate = { gte: today };
        break;
      }
    }

    const tasks = await this.prisma.task.findMany({
      where: {
        ...where,
        companyId: filters?.companyId,
        contactId: filters?.contactId,
      },
      include: {
        contact: true,
        company: true,
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: [
        {
          reminderDate: 'asc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    return tasks;
  }

  async getTaskById(id: number): Promise<PrismaRawResponse<GetTaskResponse>> {
    const task = await this.prisma.task.findUniqueOrThrow({
      where: { id },
      include: {
        contact: true,
        company: true,
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    return task;
  }

  async updateTask(id: number, data: UpdateTaskRequest): Promise<PrismaRawResponse<UpdateTaskResponse>> {
    const task = await this.prisma.task.update({
      where: { id },
      data: {
        ...data,
        reminderDate: data.reminderDate ? new Date(data.reminderDate).toISOString() : data.reminderDate,
      },
      include: {
        contact: true,
        company: true,
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    return task;
  }

  async deleteTask(id: number): Promise<PrismaRawResponse<DeleteTaskResponse>> {
    const task = await this.prisma.task.delete({
      where: { id },
    });

    return { id: task.id };
  }

  async resolveTask(id: number): Promise<PrismaRawResponse<UpdateTaskResponse>> {
    return this.updateTask(id, { resolved: true });
  }

  async unresolveTask(id: number): Promise<PrismaRawResponse<UpdateTaskResponse>> {
    return this.updateTask(id, { resolved: false });
  }
}
