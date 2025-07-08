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
import type { Prisma } from 'generated/prisma';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(
    data: CreateTaskRequest & { createdBy: number; tenantId: number }
  ): Promise<PrismaRawResponse<CreateTaskResponse>> {
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

  async getAllTasks(
    tenantId: number,
    filters?: {
      status?: 'pending' | 'resolved' | 'upcoming';
      contactId?: number;
      companyId?: number;
    }
  ): Promise<PrismaRawResponse<GetAllTasksResponse>> {
    const where: Prisma.taskWhereInput = {};

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
        tenantId,
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

  async getTaskById(tenantId: number, id: number): Promise<PrismaRawResponse<GetTaskResponse>> {
    const task = await this.prisma.task.findUniqueOrThrow({
      where: { tenantId, id },
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

  async updateTask(
    tenantId: number,
    id: number,
    data: UpdateTaskRequest
  ): Promise<PrismaRawResponse<UpdateTaskResponse>> {
    const task = await this.prisma.task.update({
      where: { tenantId, id },
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

  async deleteTask(tenantId: number, id: number): Promise<PrismaRawResponse<DeleteTaskResponse>> {
    const task = await this.prisma.task.delete({
      where: { id },
    });

    return { id: task.id };
  }

  async resolveTask(tenantId: number, id: number): Promise<PrismaRawResponse<UpdateTaskResponse>> {
    return this.updateTask(tenantId, id, { resolved: true });
  }

  async unresolveTask(tenantId: number, id: number): Promise<PrismaRawResponse<UpdateTaskResponse>> {
    return this.updateTask(tenantId, id, { resolved: false });
  }
}
