import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import type {
  CompanyDto,
  CreateCompanyRequest,
  CreateCompanyResponse,
  DeleteCompanyResponse,
  GetAllCompaniesQuery,
  GetAllCompaniesResponse,
  GetCompanyResponse,
  UpdateCompanyRequest,
  UpdateCompanyResponse,
} from '@tradelink/shared';
import type { Prisma } from 'generated/prisma';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async getCompany(id: number, tenantId: number): Promise<GetCompanyResponse> {
    const company = await this.prisma.company.findUniqueOrThrow({
      where: {
        id,
        tenantId,
      },
      include: {
        contact: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            jobTitle: true,
          },
        },
        tags: true,
      },
    });

    return company;
  }

  async createCompany(data: CreateCompanyRequest, tenantId: number): Promise<CreateCompanyResponse> {
    const company = await this.prisma.company.create({
      data: {
        ...data,
        tenantId,
      },
    });

    return company;
  }

  async updateCompany(id: number, data: UpdateCompanyRequest, tenantId: number): Promise<UpdateCompanyResponse> {
    const company = await this.prisma.company.update({
      where: {
        id,
        tenantId,
      },
      data,
      include: {
        tags: true,
      },
    });

    return company;
  }

  async deleteCompany(id: number, tenantId: number): Promise<DeleteCompanyResponse> {
    await this.prisma.company.delete({
      where: {
        id,
        tenantId,
      },
    });

    return { success: true, message: 'Company deleted successfully' };
  }

  async assignTags(id: number, tagIds: number[], tenantId: number): Promise<CompanyDto> {
    const company = await this.prisma.company.update({
      where: {
        id,
        tenantId,
      },
      data: {
        tags: {
          connect: tagIds.map(tagId => ({ id: tagId })),
        },
      },
      include: {
        tags: true,
      },
    });

    return company;
  }

  async unassignTags(id: number, tagIds: number[], tenantId: number): Promise<CompanyDto> {
    const company = await this.prisma.company.update({
      where: {
        id,
        tenantId,
      },
      data: {
        tags: {
          disconnect: tagIds.map(tagId => ({ id: tagId })),
        },
      },
      include: {
        tags: true,
      },
    });

    return company;
  }

  async getAllCompanies(query: GetAllCompaniesQuery, tenantId: number): Promise<GetAllCompaniesResponse> {
    const { search, page, size, sortBy, sortOrder, tagIds } = query;

    const whereClause: Prisma.companyWhereInput = {
      tenantId,
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phoneNumber: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        tagIds?.length
          ? {
              AND: tagIds.map(tagId => ({
                tags: {
                  some: {
                    id: tagId,
                  },
                },
              })),
            }
          : {},
      ],
    };

    let orderBy: Prisma.companyOrderByWithRelationInput = {};

    if (sortBy === 'contacts') {
      orderBy = {
        contact: {
          _count: sortOrder,
        },
      };
    } else {
      orderBy = { [sortBy || 'createdAt']: sortOrder || 'desc' };
    }

    const companies = await this.prisma.company.findMany({
      where: whereClause,
      include: {
        contact: { select: { id: true } },
        tags: true,
      },
      orderBy,
      take: size,
      skip: (page - 1) * size,
    });

    return companies.map(company => ({
      ...company,
      contacts: company.contact.length,
    }));
  }

  async findCompaniesByNames(tenantId: number, names: string[]) {
    if (names.length === 0) {
      return [];
    }
    return this.prisma.company.findMany({
      where: {
        tenantId,
        name: {
          in: names,
          mode: 'insensitive',
        },
        ...(tenantId && { tenantId }),
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async createManyCompanies(tenantId: number, companies: CreateCompanyRequest[], tx?: Prisma.TransactionClient) {
    const prismaClient = tx || this.prisma;
    const companiesWithTenant = companies.map(company => ({
      ...company,
      tenantId,
    }));

    return prismaClient.company.createManyAndReturn({
      data: companiesWithTenant,
      select: {
        id: true,
        name: true,
      },
    });
  }

  async bulkUpdateCompanies(
    updates: Array<{ id: number; data: UpdateCompanyRequest }>,
    tenantId: number,
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    const prismaClient = tx || this.prisma;
    await Promise.all(
      updates.map(({ id, data }) =>
        prismaClient.company.update({
          where: {
            id,
            tenantId,
          },
          data,
        })
      )
    );
  }

  async findCompaniesByIds(ids: number[], tenantId?: number) {
    if (ids.length === 0) {
      return [];
    }
    return this.prisma.company.findMany({
      where: {
        id: {
          in: ids,
        },
        ...(tenantId && { tenantId }),
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findCompaniesByEmails(
    tenantId: number,
    emails: string[]
  ): Promise<Map<string, { id: number; name: string; email: string }>> {
    if (emails.length === 0) {
      return new Map();
    }

    const companies = await this.prisma.company.findMany({
      where: {
        email: {
          in: emails,
        },
        ...(tenantId && { tenantId }),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // Create a map for quick lookup by email
    const companyMap = new Map<string, { id: number; name: string; email: string }>();
    for (const company of companies) {
      if (company.email) {
        companyMap.set(company.email, {
          id: company.id,
          name: company.name,
          email: company.email,
        });
      }
    }

    return companyMap;
  }
}
