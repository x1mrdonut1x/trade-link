import { Injectable } from '@nestjs/common';
import type {
  CreateNoteRequest,
  CreateNoteResponse,
  DeleteNoteResponse,
  GetAllNotesResponse,
  GetNoteResponse,
  PrismaRawResponse,
  UpdateNoteRequest,
  UpdateNoteResponse,
} from '@tradelink/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async createNote(data: CreateNoteRequest & { createdBy: number }): Promise<PrismaRawResponse<CreateNoteResponse>> {
    const note = await this.prisma.note.create({
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

    return note;
  }

  async getAllNotes(): Promise<PrismaRawResponse<GetAllNotesResponse>> {
    const notes = await this.prisma.note.findMany({
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
        createdAt: 'desc',
      },
    });

    return notes;
  }

  async getNoteById(id: number): Promise<PrismaRawResponse<GetNoteResponse>> {
    const note = await this.prisma.note.findUniqueOrThrow({
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

    return note;
  }

  async updateNote(id: number, data: UpdateNoteRequest): Promise<PrismaRawResponse<UpdateNoteResponse>> {
    const note = await this.prisma.note.update({
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

    return note;
  }

  async deleteNote(id: number): Promise<PrismaRawResponse<DeleteNoteResponse>> {
    const note = await this.prisma.note.delete({
      where: { id },
    });

    return { id: note.id };
  }

  async getNotesByContactId(contactId: number): Promise<PrismaRawResponse<GetAllNotesResponse>> {
    const notes = await this.prisma.note.findMany({
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
        createdAt: 'desc',
      },
    });

    return notes;
  }

  async getNotesByCompanyId(companyId: number): Promise<PrismaRawResponse<GetAllNotesResponse>> {
    const notes = await this.prisma.note.findMany({
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
        createdAt: 'desc',
      },
    });

    return notes;
  }
}
