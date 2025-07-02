import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from 'generated/prisma';
import type {
  CreateCompanyRequest,
  CreateCompanyResponse,
  DeleteCompanyResponse,
  GetAllCompaniesResponse,
  GetCompanyResponse,
  UpdateCompanyRequest,
  UpdateCompanyResponse,
} from '@tradelink/shared';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async getCompany(id: number): Promise<GetCompanyResponse> {
    const company = await this.prisma.company.findUniqueOrThrow({
      where: { id },
      include: {
        contact: true,
        company_type_tag: true,
      },
    });

    return company;
  }

  async createCompany(
    data: CreateCompanyRequest,
  ): Promise<CreateCompanyResponse> {
    // Create company with tags if provided
    const company = await this.prisma.company.create({
      data,
    });

    return company;
  }

  async updateCompany(
    id: number,
    data: UpdateCompanyRequest,
  ): Promise<UpdateCompanyResponse> {
    const company = await this.prisma.company.update({
      where: { id },
      data,
      include: {
        company_type_tag: true,
      },
    });

    return company;
  }

  async deleteCompany(id: number): Promise<DeleteCompanyResponse> {
    await this.prisma.company.delete({
      where: { id },
    });

    return { success: true, message: 'Company deleted successfully' };
  }

  async getAllCompanies(search?: string): Promise<GetAllCompaniesResponse> {
    const whereClause: Prisma.companyWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phoneNumber: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const companies = await this.prisma.company.findMany({
      where: whereClause,
    });

    return companies;
  }
}
