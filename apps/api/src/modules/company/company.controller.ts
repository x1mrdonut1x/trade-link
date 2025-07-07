import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { CompanyService } from './company.service';

import {
  AssignTagsRequest,
  CompanyDto,
  CreateCompanyRequest,
  DeleteCompanyResponse,
  GetAllCompaniesQuery,
  GetAllCompaniesResponse,
  GetCompanyResponse,
  UnassignTagsRequest,
  UpdateCompanyRequest,
} from '@tradelink/shared';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getAllCompanies(@Query() query: GetAllCompaniesQuery): Promise<GetAllCompaniesResponse> {
    return this.companyService.getAllCompanies(query);
  }

  @Get(':id')
  async getCompany(@Param('id', ParseIntPipe) id: number): Promise<GetCompanyResponse> {
    return this.companyService.getCompany(id);
  }

  @Post()
  async createCompany(@Body() createCompanyDto: CreateCompanyRequest): Promise<CompanyDto> {
    return this.companyService.createCompany(createCompanyDto);
  }

  @Put(':id')
  async updateCompany(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: UpdateCompanyRequest
  ): Promise<CompanyDto> {
    return this.companyService.updateCompany(id, updateCompanyDto);
  }

  @Delete(':id')
  async deleteCompany(@Param('id', ParseIntPipe) id: number): Promise<DeleteCompanyResponse> {
    return this.companyService.deleteCompany(id);
  }

  @Patch(':id/tags/assign')
  async assignTags(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignTagsDto: AssignTagsRequest
  ): Promise<CompanyDto> {
    return this.companyService.assignTags(id, assignTagsDto.tagIds);
  }

  @Patch(':id/tags/unassign')
  async unassignTags(
    @Param('id', ParseIntPipe) id: number,
    @Body() unassignTagsDto: UnassignTagsRequest
  ): Promise<CompanyDto> {
    return this.companyService.unassignTags(id, unassignTagsDto.tagIds);
  }
}
