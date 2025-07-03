import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from 'generated/prisma';
import type {
  CreateContactRequest,
  CreateContactResponse,
  DeleteContactResponse,
  GetAllContactsQuery,
  GetAllContactsResponse,
  GetContactResponse,
  UpdateContactRequest,
  UpdateContactResponse,
} from '@tradelink/shared';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async getContact(id: number): Promise<GetContactResponse> {
    const contact = await this.prisma.contact.findUniqueOrThrow({
      where: { id },
      include: {
        company: true,
      },
    });

    return contact;
  }

  async createContact(
    data: CreateContactRequest,
  ): Promise<CreateContactResponse> {
    const contact = await this.prisma.contact.create({
      data,
      include: {
        company: true,
      },
    });

    return contact;
  }

  async updateContact(
    id: number,
    data: UpdateContactRequest,
  ): Promise<UpdateContactResponse> {
    const contact = await this.prisma.contact.update({
      where: { id },
      data,
      include: {
        company: true,
      },
    });

    return contact;
  }

  async deleteContact(id: number): Promise<DeleteContactResponse> {
    await this.prisma.contact.delete({
      where: { id },
    });

    return { success: true, message: 'Contact deleted successfully' };
  }

  async getAllContacts(
    query: GetAllContactsQuery,
  ): Promise<GetAllContactsResponse> {
    const { search, page, size } = query;

    const whereClause: Prisma.contactWhereInput = query?.search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { phoneNumber: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { jobTitle: { contains: search, mode: 'insensitive' } },
            { company: { name: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : {};

    const contacts = await this.prisma.contact.findMany({
      where: whereClause,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
            phonePrefix: true,
            email: true,
          },
        },
      },
      take: size,
      skip: (page - 1) * size,
      orderBy: {
        firstName: 'asc',
      },
    });

    return contacts;
  }
}
