import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactRequest, UpdateContactRequest } from '@tradelink/shared';
import type {
  ContactWithCompanyDto,
  DeleteContactResponseDto,
} from '@tradelink/shared';

@Controller('contacts')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  async getAllContacts(): Promise<ContactWithCompanyDto[]> {
    return this.contactService.getAllContacts();
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
  ): Promise<DeleteContactResponseDto> {
    return this.contactService.deleteContact(id);
  }
}
