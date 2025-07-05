import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import type { GetDashboardStatsResponse } from '@tradelink/shared';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(): Promise<GetDashboardStatsResponse> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get total companies and recent companies
    const [totalCompanies, recentCompanies] = await Promise.all([
      this.prisma.company.count(),
      this.prisma.company.count({
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      }),
    ]);

    // Get total contacts and recent contacts
    const [totalContacts, recentContacts] = await Promise.all([
      this.prisma.contact.count(),
      this.prisma.contact.count({
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      }),
    ]);

    return {
      totalCompanies,
      recentCompanies,
      totalContacts,
      recentContacts,
    };
  }
}
