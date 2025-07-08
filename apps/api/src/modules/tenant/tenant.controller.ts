import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { TenantService } from './tenant.service';

import type {
  CreateTenantRequest,
  CreateTenantResponse,
  DeleteTenantResponse,
  GetTenantResponse,
  GetUserTenantsResponse,
  UpdateTenantRequest,
  UpdateTenantResponse,
} from '@tradelink/shared';

@Controller('tenants')
@UseGuards(JwtAuthGuard)
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get()
  async getUserTenants(@Request() req): Promise<GetUserTenantsResponse> {
    return this.tenantService.getUserTenants(req.user.id);
  }

  @Get(':id')
  async getTenant(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<GetTenantResponse> {
    return this.tenantService.getTenantById(id, req.user.id);
  }

  @Post()
  async createTenant(@Body() createTenantDto: CreateTenantRequest, @Request() req): Promise<CreateTenantResponse> {
    return this.tenantService.createTenant(createTenantDto, req.user.id);
  }

  @Put(':id')
  async updateTenant(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTenantDto: UpdateTenantRequest,
    @Request() req
  ): Promise<UpdateTenantResponse> {
    return this.tenantService.updateTenant(id, updateTenantDto, req.user.id);
  }

  @Delete(':id')
  async deleteTenant(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<DeleteTenantResponse> {
    return this.tenantService.deleteTenant(id, req.user.id);
  }
}
