import { Injectable } from '@nestjs/common';
import type {
  CreateEventDto,
  CreateEventResponse,
  DeleteEventResponse,
  EventDto,
  GetAllEventsQueryDto,
  GetAllEventsResponse,
  GetEventResponse,
  UpdateEventDto,
  UpdateEventResponse,
} from '@tradelink/shared';
import type { Prisma } from 'generated/prisma';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async createEvent(createEventDto: CreateEventDto, createdBy: number, tenantId: number): Promise<CreateEventResponse> {
    const { companyIds, contactIds, tagIds, ...eventData } = createEventDto;

    const event = await this.prisma.event.create({
      data: {
        ...eventData,
        startDate: new Date(createEventDto.startDate).toISOString(),
        endDate: new Date(createEventDto.endDate).toISOString(),
        createdBy,
        tenantId,
        ...(companyIds?.length
          ? {
              companies: {
                connect: companyIds.map(id => ({ id })),
              },
            }
          : {}),
        ...(contactIds?.length
          ? {
              contacts: {
                connect: contactIds.map(id => ({ id })),
              },
            }
          : {}),
        ...(tagIds?.length
          ? {
              tags: {
                connect: tagIds.map(id => ({ id })),
              },
            }
          : {}),
      },
      include: {
        tags: true,
      },
    });

    return {
      ...event,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };
  }

  async getAllEvents(tenantId: number, query: GetAllEventsQueryDto): Promise<GetAllEventsResponse> {
    const {
      page = 1,
      size = 10,
      search,
      status,
      startDate,
      endDate,
      tagIds,
      sortBy = 'startDate',
      sortOrder = 'asc',
    } = query;

    const where: Prisma.eventWhereInput = {
      tenantId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { type: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
          { venue: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(status && { status }),
      ...(startDate && { startDate: { gte: startDate } }),
      ...(endDate && { endDate: { lte: endDate } }),
      ...(tagIds?.length && {
        tags: {
          some: {
            id: {
              in: tagIds,
            },
          },
        },
      }),
    };

    const events = await this.prisma.event.findMany({
      where,
      include: {
        tags: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * size,
      take: size,
    });

    return events.map(event => ({
      ...event,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    }));
  }

  async getEventById(tenantId: number, eventId: number): Promise<GetEventResponse> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId, tenantId },
      include: {
        tags: true,
        companies: {
          include: {
            _count: {
              select: { contact: true },
            },
          },
        },
        contacts: {
          include: {
            company: {
              select: { name: true },
            },
          },
        },
        schedule: {
          include: {
            contacts: {
              include: {
                company: {
                  select: { name: true },
                },
              },
            },
          },
          orderBy: { time: 'asc' },
        },
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return {
      ...event,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
      companies: event.companies.map(company => ({
        id: company.id,
        name: company.name,
        contactsCount: company._count.contact,
      })),
      contacts: event.contacts.map(contact => ({
        id: contact.id,
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        jobTitle: contact.jobTitle,
        companyName: contact.company?.name || null,
      })),
      schedule: event.schedule.map(schedule => ({
        id: schedule.id,
        time: schedule.time,
        title: schedule.title,
        description: schedule.description,
        type: schedule.type,
        location: schedule.location,
        contacts: schedule.contacts.map(contact => ({
          id: contact.id,
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          jobTitle: contact.jobTitle,
          companyName: contact.company?.name || null,
        })),
      })),
    };
  }

  async updateEvent(tenantId: number, eventId: number, updateEventDto: UpdateEventDto): Promise<UpdateEventResponse> {
    const { companyIds, contactIds, tagIds, ...eventData } = updateEventDto;

    const event = await this.prisma.event.update({
      where: { id: eventId, tenantId },
      data: {
        ...eventData,
        startDate: eventData.startDate ? new Date(eventData.startDate).toISOString() : undefined,
        endDate: eventData.endDate ? new Date(eventData.endDate).toISOString() : undefined,
        ...(companyIds !== undefined
          ? {
              companies: {
                set: companyIds.map(id => ({ id })),
              },
            }
          : {}),
        ...(contactIds !== undefined
          ? {
              contacts: {
                set: contactIds.map(id => ({ id })),
              },
            }
          : {}),
        ...(tagIds !== undefined
          ? {
              tags: {
                set: tagIds.map(id => ({ id })),
              },
            }
          : {}),
      },
      include: {
        tags: true,
      },
    });

    return {
      ...event,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };
  }

  async deleteEvent(tenantId: number, eventId: number): Promise<DeleteEventResponse> {
    await this.prisma.event.delete({
      where: { id: eventId, tenantId },
    });

    return {
      success: true,
      message: 'Event deleted successfully',
    };
  }

  async assignTags(eventId: number, tagIds: number[], tenantId: number): Promise<EventDto> {
    const event = await this.prisma.event.update({
      where: { id: eventId, tenantId },
      data: {
        tags: {
          connect: tagIds.map(id => ({ id })),
        },
      },
      include: {
        tags: true,
      },
    });

    return {
      ...event,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };
  }

  async unassignTags(eventId: number, tagIds: number[], tenantId: number): Promise<EventDto> {
    const event = await this.prisma.event.update({
      where: { id: eventId, tenantId },
      data: {
        tags: {
          disconnect: tagIds.map(id => ({ id })),
        },
      },
      include: {
        tags: true,
      },
    });

    return {
      ...event,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };
  }
}
