import { Injectable } from '@nestjs/common';
import type { CreateEventScheduleDto, EventScheduleDto, UpdateEventScheduleDto } from '@tradelink/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventScheduleService {
  constructor(private prisma: PrismaService) {}

  async createEventSchedule(
    tenantId: number,
    eventId: number,
    createEventScheduleDto: CreateEventScheduleDto
  ): Promise<EventScheduleDto> {
    const { contactIds, ...scheduleData } = createEventScheduleDto;

    const schedule = await this.prisma.eventSchedule.create({
      data: {
        ...scheduleData,
        eventId,
        ...(contactIds && contactIds.length > 0
          ? {
              contacts: {
                connect: contactIds.map(id => ({ id })),
              },
            }
          : {}),
      },
      include: {
        contacts: {
          include: {
            company: {
              select: { name: true },
            },
          },
        },
      },
    });

    return {
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
    };
  }

  async getEventSchedules(tenantId: number, eventId: number): Promise<EventScheduleDto[]> {
    const schedules = await this.prisma.eventSchedule.findMany({
      where: {
        eventId,
        event: { tenantId },
      },
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
    });

    return schedules.map(schedule => ({
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
    }));
  }

  async updateEventSchedule(
    tenantId: number,
    eventId: number,
    scheduleId: number,
    updateEventScheduleDto: UpdateEventScheduleDto
  ): Promise<EventScheduleDto> {
    const { contactIds, ...scheduleData } = updateEventScheduleDto;

    const schedule = await this.prisma.eventSchedule.update({
      where: {
        id: scheduleId,
        eventId,
        event: { tenantId },
      },
      data: {
        ...scheduleData,
        ...(contactIds !== undefined
          ? {
              contacts: {
                set: contactIds.map(id => ({ id })),
              },
            }
          : {}),
      },
      include: {
        contacts: {
          include: {
            company: {
              select: { name: true },
            },
          },
        },
      },
    });

    return {
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
    };
  }

  async deleteEventSchedule(tenantId: number, eventId: number, scheduleId: number): Promise<void> {
    await this.prisma.eventSchedule.delete({
      where: {
        id: scheduleId,
        eventId,
        event: { tenantId },
      },
    });
  }
}
