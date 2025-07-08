import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import {
  ContactWithCompanyDto,
  CreateContactRequest,
  CreateContactResponse,
  DeleteContactResponse,
  GetAllContactsQuery,
  GetAllContactsResponse,
  GetContactResponse,
  UpdateContactRequest,
  UpdateContactResponse,
} from '@tradelink/shared';
import type { Prisma } from 'generated/prisma';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async getContact(tenantId: number, id: number): Promise<GetContactResponse> {
    const contact = await this.prisma.contact.findUniqueOrThrow({
      where: { tenantId, id },
      include: {
        company: true,
        tags: true,
      },
    });

    return contact;
  }

  async createContact(data: CreateContactRequest, tenantId: number): Promise<CreateContactResponse> {
    const contact = await this.prisma.contact.create({
      data: {
        ...data,
        tenantId,
      },
      include: {
        company: true,
        tags: true,
      },
    });

    return contact;
  }

  async updateContact(tenantId: number, id: number, data: UpdateContactRequest): Promise<UpdateContactResponse> {
    const contact = await this.prisma.contact.update({
      where: { tenantId, id },
      data,
      include: {
        company: true,
        tags: true,
      },
    });

    return contact;
  }

  async deleteContact(tenantId: number, id: number): Promise<DeleteContactResponse> {
    await this.prisma.contact.delete({
      where: { tenantId, id },
    });

    return { success: true, message: 'Contact deleted successfully' };
  }

  async getAllContacts(tenantId: number, query: GetAllContactsQuery): Promise<GetAllContactsResponse> {
    const { search, page, size, tagIds } = query;

    const whereClause: Prisma.contactWhereInput = {
      tenantId,
      AND: [
        search
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
          : {},
        tagIds && tagIds.length > 0
          ? {
              tags: {
                some: {
                  id: {
                    in: tagIds,
                  },
                },
              },
            }
          : {},
      ],
    };

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
        tags: true,
      },
      take: size,
      skip: (page - 1) * size,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return contacts;
  }

  async findContactByEmail(email: string, tenantId?: number): Promise<GetContactResponse | null> {
    if (!email) {
      return null;
    }

    if (!tenantId) {
      // For backwards compatibility, but this should generally not be used
      return this.prisma.contact.findFirst({
        where: { email },
        include: {
          company: true,
        },
      });
    }

    return this.prisma.contact.findUnique({
      where: {
        email_tenantId: {
          email,
          tenantId,
        },
      },
      include: {
        company: true,
      },
    });
  }

  async findContactsByEmails(tenantId: number, emails: string[]): Promise<Map<string, GetContactResponse>> {
    if (emails.length === 0) {
      return new Map();
    }

    const contacts = await this.prisma.contact.findMany({
      where: {
        email: {
          in: emails,
        },
      },
      include: {
        company: true,
      },
    });

    // Create a map for quick lookup by email
    const contactMap = new Map<string, GetContactResponse>();
    for (const contact of contacts) {
      contactMap.set(contact.email, contact);
    }

    return contactMap;
  }

  async createManyContacts(tenantId: number, contacts: CreateContactRequest[], tx?: Prisma.TransactionClient) {
    const prismaClient = tx || this.prisma;
    const contactsWithTenant = contacts.map(contact => ({
      ...contact,
      tenantId,
    }));

    return prismaClient.contact.createManyAndReturn({
      data: contactsWithTenant,
      select: {
        id: true,
        email: true,
      },
    });
  }

  async bulkUpdateContacts(
    tenantId: number,
    updates: Array<{ id: number; data: UpdateContactRequest }>,
    tx?: Prisma.TransactionClient
  ) {
    const prismaClient = tx || this.prisma;
    await Promise.all(
      updates.map(({ id, data }) =>
        prismaClient.contact.update({
          where: { id },
          data,
        })
      )
    );
  }

  async assignTags(tenantId: number, id: number, tagIds: number[]): Promise<ContactWithCompanyDto> {
    const contact = await this.prisma.contact.update({
      where: { tenantId, id },
      data: {
        tags: {
          connect: tagIds.map(tagId => ({ id: tagId })),
        },
      },
      include: {
        company: true,
        tags: true,
      },
    });

    return contact;
  }

  async unassignTags(tenantId: number, id: number, tagIds: number[]): Promise<ContactWithCompanyDto> {
    const contact = await this.prisma.contact.update({
      where: { tenantId, id },
      data: {
        tags: {
          disconnect: tagIds.map(tagId => ({ id: tagId })),
        },
      },
      include: {
        company: true,
        tags: true,
      },
    });

    return contact;
  }
}
