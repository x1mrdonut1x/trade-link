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
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  AssignTagsRequest,
  CreateEventRequest,
  GetAllEventsQuery,
  UnassignTagsRequest,
  UpdateEventRequest,
} from '@tradelink/shared';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { TenantAuthGuard } from '../../guards/tenant-auth.guard';
import { EventsService } from './events.service';

import type {
  CreateEventResponse,
  DeleteEventResponse,
  EventDto,
  GetAllEventsResponse,
  GetEventResponse,
  UpdateEventResponse,
} from '@tradelink/shared';

@Controller('events')
@UseGuards(JwtAuthGuard, TenantAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(
    @Headers('tenant-id') tenantId: string,
    @Body() createEventDto: CreateEventRequest,
    @Request() req: any
  ): Promise<CreateEventResponse> {
    return this.eventsService.createEvent(createEventDto, req.user.id, Number.parseInt(tenantId));
  }

  @Get()
  async getAllEvents(
    @Headers('tenant-id') tenantId: string,
    @Query() query: GetAllEventsQuery
  ): Promise<GetAllEventsResponse> {
    return this.eventsService.getAllEvents(Number.parseInt(tenantId), query);
  }

  @Get(':id')
  async getEvent(
    @Headers('tenant-id') tenantId: string,
    @Param('id', ParseIntPipe) id: number
  ): Promise<GetEventResponse> {
    return this.eventsService.getEventById(Number.parseInt(tenantId), id);
  }

  @Put(':id')
  async updateEvent(
    @Headers('tenant-id') tenantId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventRequest
  ): Promise<UpdateEventResponse> {
    return this.eventsService.updateEvent(Number.parseInt(tenantId), id, updateEventDto);
  }

  @Delete(':id')
  async deleteEvent(
    @Headers('tenant-id') tenantId: string,
    @Param('id', ParseIntPipe) id: number
  ): Promise<DeleteEventResponse> {
    return this.eventsService.deleteEvent(Number.parseInt(tenantId), id);
  }

  @Patch(':id/tags/assign')
  async assignTags(
    @Headers('tenant-id') tenantId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() assignTagsDto: AssignTagsRequest
  ): Promise<EventDto> {
    return this.eventsService.assignTags(id, assignTagsDto.tagIds, Number.parseInt(tenantId));
  }

  @Patch(':id/tags/unassign')
  async unassignTags(
    @Headers('tenant-id') tenantId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() unassignTagsDto: UnassignTagsRequest
  ): Promise<EventDto> {
    return this.eventsService.unassignTags(id, unassignTagsDto.tagIds, Number.parseInt(tenantId));
  }
}
