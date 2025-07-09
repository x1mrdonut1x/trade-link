import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import type { GetDashboardStatsResponse, GetUpcomingEventsResponse } from '@tradelink/shared';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(tenantId: number): Promise<GetDashboardStatsResponse> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get total companies and recent companies
    const [totalCompanies, recentCompanies] = await Promise.all([
      this.prisma.company.count({ where: { tenantId } }),
      this.prisma.company.count({
        where: {
          tenantId,
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      }),
    ]);

    // Get total contacts and recent contacts
    const [totalContacts, recentContacts] = await Promise.all([
      this.prisma.contact.count({ where: { tenantId } }),
      this.prisma.contact.count({
        where: {
          tenantId,
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      }),
    ]);

    // Get total events and recent events
    const [totalEvents, recentEvents] = await Promise.all([
      this.prisma.event.count({ where: { tenantId } }),
      this.prisma.event.count({
        where: {
          tenantId,
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
      totalEvents,
      recentEvents,
    };
  }

  async getUpcomingEvents(): Promise<GetUpcomingEventsResponse> {
    const now = new Date();
    const events = await this.prisma.event.findMany({
      where: {
        startDate: {
          gte: now.toISOString().split('T')[0], // Get events starting today or later
        },
        status: {
          in: ['Planning', 'Confirmed', 'In Progress'],
        },
      },
      orderBy: {
        startDate: 'asc',
      },
      take: 5, // Limit to 5 upcoming events
      select: {
        id: true,
        name: true,
        type: true,
        startDate: true,
        endDate: true,
        location: true,
        status: true,
      },
    });

    return {
      events: events.map(event => ({
        ...event,
        startDate: event.startDate.toISOString().split('T')[0],
        endDate: event.endDate.toISOString().split('T')[0],
      })),
    };
  }
}
