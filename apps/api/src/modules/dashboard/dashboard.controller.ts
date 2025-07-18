import { Controller, Get, Headers, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

import type { GetDashboardStatsResponse } from '@tradelink/shared';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getDashboardStats(@Headers('tenant-id') tenantId: string): Promise<GetDashboardStatsResponse> {
    return this.dashboardService.getDashboardStats(Number.parseInt(tenantId));
  }
}
