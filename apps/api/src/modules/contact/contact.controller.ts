import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import type {
  CreateContactRequest,
  UpdateContactRequest,
  ContactWithCompanyDto,
  DeleteContactResponse,
} from '@tradelink/shared';
import { GetAllContactsQuery } from '@tradelink/shared';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('contacts')
@UseGuards(JwtAuthGuard)
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  async getAllContacts(
    @Query() query: GetAllContactsQuery,
  ): Promise<ContactWithCompanyDto[]> {
    return this.contactService.getAllContacts(query);
  }

  @Get(':id')
  async getContact(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ContactWithCompanyDto> {
    return this.contactService.getContact(id);
  }

  @Post()
  async createContact(
    @Body() createContactDto: CreateContactRequest,
  ): Promise<ContactWithCompanyDto> {
    return this.contactService.createContact(createContactDto);
  }

  @Put(':id')
  async updateContact(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContactDto: UpdateContactRequest,
  ): Promise<ContactWithCompanyDto> {
    return this.contactService.updateContact(id, updateContactDto);
  }

  @Delete(':id')
  async deleteContact(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteContactResponse> {
    return this.contactService.deleteContact(id);
  }
}
