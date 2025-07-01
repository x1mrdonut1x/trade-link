import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type {
  CreateContactRequest,
  UpdateContactRequest,
  ContactWithCompanyDto,
  DeleteContactResponseDto,
} from '@tradelink/shared';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async getContact(id: number): Promise<ContactWithCompanyDto> {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return contact;
  }

  async createContact(
    data: CreateContactRequest,
  ): Promise<ContactWithCompanyDto> {
    const { email, companyId, contactData, firstName, lastName, jobTitle } =
      data;

    const contact = await this.prisma.contact.create({
      data: {
        firstName,
        lastName,
        email,
        jobTitle: jobTitle || null,
        company: companyId ? { connect: { id: companyId } } : undefined,
        contactData:
          Object.keys(contactData).length > 0 ? contactData : undefined,
      },
      include: {
        company: true,
      },
    });

    return contact as ContactWithCompanyDto;
  }

  async updateContact(
    id: number,
    data: UpdateContactRequest,
  ): Promise<ContactWithCompanyDto> {
    const { contactData, companyId, ...rest } = data;

    // Get existing contact to merge contactData
    const existingContact = await this.prisma.contact.findUnique({
      where: { id },
    });

    if (!existingContact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    const contact = await this.prisma.contact.update({
      where: { id },
      data: {
        ...rest,
        ...(companyId !== undefined && { companyId: companyId }),
        contactData: Object.assign(existingContact, contactData),
      },
      include: {
        company: true,
      },
    });

    return contact;
  }

  async deleteContact(id: number): Promise<DeleteContactResponseDto> {
    const contact = await this.prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    await this.prisma.contact.delete({
      where: { id },
    });

    return { success: true, message: 'Contact deleted successfully' };
  }

  async getAllContacts(): Promise<ContactWithCompanyDto[]> {
    const contacts = await this.prisma.contact.findMany({
      include: {
        company: true,
      },
      orderBy: {
        firstName: 'asc',
      },
    });

    return contacts;
  }
}
