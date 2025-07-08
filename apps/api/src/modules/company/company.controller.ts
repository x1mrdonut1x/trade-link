import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { TenantAuthGuard } from '../../guards/tenant-auth.guard';
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
@UseGuards(JwtAuthGuard, TenantAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getAllCompanies(
    @Headers('tenant-id') tenantId: string,
    @Query() query: GetAllCompaniesQuery
  ): Promise<GetAllCompaniesResponse> {
    return this.companyService.getAllCompanies(query, Number.parseInt(tenantId));
  }

  @Get(':id')
  async getCompany(
    @Headers('tenant-id') tenantId: string,
    @Param('id', ParseIntPipe) id: number
  ): Promise<GetCompanyResponse> {
    return this.companyService.getCompany(id, Number.parseInt(tenantId));
  }

  @Post()
  async createCompany(
    @Headers('tenant-id') tenantId: string,
    @Body() createCompanyDto: CreateCompanyRequest
  ): Promise<CompanyDto> {
    return this.companyService.createCompany(createCompanyDto, Number.parseInt(tenantId));
  }

  @Put(':id')
  async updateCompany(
    @Headers('tenant-id') tenantId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: UpdateCompanyRequest
  ): Promise<CompanyDto> {
    return this.companyService.updateCompany(id, updateCompanyDto, Number.parseInt(tenantId));
  }

  @Delete(':id')
  async deleteCompany(
    @Headers('tenant-id') tenantId: string,
    @Param('id', ParseIntPipe) id: number
  ): Promise<DeleteCompanyResponse> {
    return this.companyService.deleteCompany(id, Number.parseInt(tenantId));
  }

  @Patch(':id/tags/assign')
  async assignTags(
    @Headers('tenant-id') tenantId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() assignTagsDto: AssignTagsRequest
  ): Promise<CompanyDto> {
    return this.companyService.assignTags(id, assignTagsDto.tagIds, Number.parseInt(tenantId));
  }

  @Patch(':id/tags/unassign')
  async unassignTags(
    @Headers('tenant-id') tenantId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() unassignTagsDto: UnassignTagsRequest
  ): Promise<CompanyDto> {
    return this.companyService.unassignTags(id, unassignTagsDto.tagIds, Number.parseInt(tenantId));
  }
}
