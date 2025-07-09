import { Body, Controller, Delete, Get, Headers, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CreateEventScheduleRequest, UpdateEventScheduleRequest } from '@tradelink/shared';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { TenantAuthGuard } from '../../guards/tenant-auth.guard';
import { EventScheduleService } from './eventSchedule.service';

import type { EventScheduleDto } from '@tradelink/shared';

@Controller('events/:eventId/schedule')
@UseGuards(JwtAuthGuard, TenantAuthGuard)
export class EventScheduleController {
  constructor(private readonly eventScheduleService: EventScheduleService) {}

  @Post()
  async createEventSchedule(
    @Headers('tenant-id') tenantId: string,
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() createEventScheduleDto: CreateEventScheduleRequest
  ): Promise<EventScheduleDto> {
    return this.eventScheduleService.createEventSchedule(Number.parseInt(tenantId), eventId, createEventScheduleDto);
  }

  @Get()
  async getEventSchedules(
    @Headers('tenant-id') tenantId: string,
    @Param('eventId', ParseIntPipe) eventId: number
  ): Promise<EventScheduleDto[]> {
    return this.eventScheduleService.getEventSchedules(Number.parseInt(tenantId), eventId);
  }

  @Put(':scheduleId')
  async updateEventSchedule(
    @Headers('tenant-id') tenantId: string,
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
    @Body() updateEventScheduleDto: UpdateEventScheduleRequest
  ): Promise<EventScheduleDto> {
    return this.eventScheduleService.updateEventSchedule(
      Number.parseInt(tenantId),
      eventId,
      scheduleId,
      updateEventScheduleDto
    );
  }

  @Delete(':scheduleId')
  async deleteEventSchedule(
    @Headers('tenant-id') tenantId: string,
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('scheduleId', ParseIntPipe) scheduleId: number
  ): Promise<void> {
    return this.eventScheduleService.deleteEventSchedule(Number.parseInt(tenantId), eventId, scheduleId);
  }
}
