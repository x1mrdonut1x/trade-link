import { ForbiddenException, Injectable } from '@nestjs/common';
import type {
  CreateTenantRequest,
  CreateTenantResponse,
  DeleteTenantResponse,
  GetTenantResponse,
  GetUserTenantsResponse,
  PrismaRawResponse,
  UpdateTenantRequest,
  UpdateTenantResponse,
} from '@tradelink/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  async createTenant(data: CreateTenantRequest, userId: number): Promise<PrismaRawResponse<CreateTenantResponse>> {
    // Create tenant and automatically add the creator as a member
    const tenant = await this.prisma.tenant.create({
      data: {
        name: data.name,
        membership: {
          create: {
            userId: userId,
          },
        },
      },
      include: {
        membership: true,
      },
    });

    return {
      id: tenant.id,
      name: tenant.name,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
    };
  }

  async getUserTenants(userId: number): Promise<PrismaRawResponse<GetUserTenantsResponse>> {
    const memberships = await this.prisma.membership.findMany({
      where: { userId },
      include: {
        tenant: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const tenants = memberships.map(membership => ({
      ...membership.tenant,
      membership: {
        id: membership.id,
        createdAt: membership.createdAt,
        updatedAt: membership.updatedAt,
      },
    }));

    return { tenants };
  }

  async getTenantById(tenantId: number, userId: number): Promise<PrismaRawResponse<GetTenantResponse>> {
    // Check if user has access to this tenant
    await this.validateTenantAccess(tenantId, userId);

    const tenant = await this.prisma.tenant.findUniqueOrThrow({
      where: { id: tenantId },
    });

    return tenant;
  }

  async updateTenant(
    tenantId: number,
    data: UpdateTenantRequest,
    userId: number
  ): Promise<PrismaRawResponse<UpdateTenantResponse>> {
    // Check if user has access to this tenant
    await this.validateTenantAccess(tenantId, userId);

    const tenant = await this.prisma.tenant.update({
      where: { id: tenantId },
      data,
    });

    return tenant;
  }

  async deleteTenant(tenantId: number, userId: number): Promise<DeleteTenantResponse> {
    // Check if user has access to this tenant
    await this.validateTenantAccess(tenantId, userId);

    await this.prisma.tenant.delete({
      where: { id: tenantId },
    });

    return { message: 'Tenant deleted successfully' };
  }

  async validateTenantAccess(tenantId: number, userId: number): Promise<void> {
    const membership = await this.prisma.membership.findFirst({
      where: {
        tenantId,
        userId,
      },
    });

    if (!membership) {
      throw new ForbiddenException('You do not have access to this tenant');
    }
  }
}
