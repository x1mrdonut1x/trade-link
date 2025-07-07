import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { GetAllContactsQuery } from '@tradelink/shared';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ContactService } from './contact.service';

import type {
  AssignTagsRequest,
  ContactWithCompanyDto,
  CreateContactRequest,
  DeleteContactResponse,
  UnassignTagsRequest,
  UpdateContactRequest,
} from '@tradelink/shared';

@Controller('contacts')
@UseGuards(JwtAuthGuard)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  async getAllContacts(@Query() query: GetAllContactsQuery): Promise<ContactWithCompanyDto[]> {
    return this.contactService.getAllContacts(query);
  }

  @Get(':id')
  async getContact(@Param('id', ParseIntPipe) id: number): Promise<ContactWithCompanyDto> {
    return this.contactService.getContact(id);
  }

  @Post()
  async createContact(@Body() createContactDto: CreateContactRequest): Promise<ContactWithCompanyDto> {
    return this.contactService.createContact(createContactDto);
  }

  @Put(':id')
  async updateContact(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContactDto: UpdateContactRequest
  ): Promise<ContactWithCompanyDto> {
    return this.contactService.updateContact(id, updateContactDto);
  }

  @Delete(':id')
  async deleteContact(@Param('id', ParseIntPipe) id: number): Promise<DeleteContactResponse> {
    return this.contactService.deleteContact(id);
  }

  @Patch(':id/tags/assign')
  async assignTags(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignTagsDto: AssignTagsRequest
  ): Promise<ContactWithCompanyDto> {
    return this.contactService.assignTags(id, assignTagsDto.tagIds);
  }

  @Patch(':id/tags/unassign')
  async unassignTags(
    @Param('id', ParseIntPipe) id: number,
    @Body() unassignTagsDto: UnassignTagsRequest
  ): Promise<ContactWithCompanyDto> {
    return this.contactService.unassignTags(id, unassignTagsDto.tagIds);
  }
}
