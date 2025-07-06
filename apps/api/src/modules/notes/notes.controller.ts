import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { CreateNoteRequest, UpdateNoteRequest } from '@tradelink/shared';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteRequest, @Request() req) {
    return this.notesService.createNote({
      ...createNoteDto,
      createdBy: req.user.id,
    });
  }

  @Get()
  findAll() {
    return this.notesService.getAllNotes();
  }

  @Get('contact/:contactId')
  findByContactId(@Param('contactId', ParseIntPipe) contactId: number) {
    return this.notesService.getNotesByContactId(contactId);
  }

  @Get('company/:companyId')
  findByCompanyId(@Param('companyId', ParseIntPipe) companyId: number) {
    return this.notesService.getNotesByCompanyId(companyId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.getNoteById(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateNoteDto: UpdateNoteRequest) {
    return this.notesService.updateNote(id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.notesService.deleteNote(id);
  }
}
