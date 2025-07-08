import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { TenantService } from '../modules/tenant/tenant.service';

@Injectable()
export class TenantAuthGuard implements CanActivate {
  constructor(private tenantService: TenantService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const tenantId = request.headers['tenant-id'];

    // If no tenant ID is provided, allow the request (for endpoints that don't require tenant context)
    if (!tenantId) {
      return true;
    }

    // If user is not authenticated, this should be caught by JwtAuthGuard first
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Validate tenant access
    try {
      await this.tenantService.validateTenantAccess(Number.parseInt(tenantId), user.id);
      return true;
    } catch {
      throw new ForbiddenException('Access to this tenant is not allowed');
    }
  }
}
