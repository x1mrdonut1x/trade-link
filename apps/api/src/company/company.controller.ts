import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import type {
  CreateCompanyRequest,
  UpdateCompanyRequest,
  CompanyDto,
  GetAllCompaniesResponse,
  GetCompanyResponse,
  DeleteCompanyResponse,
} from '@tradelink/shared';
import { GetAllCompaniesQuery } from '@tradelink/shared';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getAllCompanies(
    @Query() query: GetAllCompaniesQuery,
  ): Promise<GetAllCompaniesResponse> {
    return this.companyService.getAllCompanies(query);
  }

  @Get(':id')
  async getCompany(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetCompanyResponse> {
    return this.companyService.getCompany(id);
  }

  @Post()
  async createCompany(
    @Body() createCompanyDto: CreateCompanyRequest,
  ): Promise<CompanyDto> {
    return this.companyService.createCompany(createCompanyDto);
  }

  @Put(':id')
  async updateCompany(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: UpdateCompanyRequest,
  ): Promise<CompanyDto> {
    return this.companyService.updateCompany(id, updateCompanyDto);
  }

  @Delete(':id')
  async deleteCompany(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteCompanyResponse> {
    return this.companyService.deleteCompany(id);
  }
}
