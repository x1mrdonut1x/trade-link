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
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateNoteRequest, GetAllNotesRequest, UpdateNoteRequest } from '@tradelink/shared';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { TenantAuthGuard } from '../../guards/tenant-auth.guard';
import { NotesService } from './notes.service';

@Controller('notes')
@UseGuards(JwtAuthGuard, TenantAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Headers('tenant-id') tenantId: string, @Body() createNoteDto: CreateNoteRequest, @Request() req) {
    return this.notesService.createNote({
      ...createNoteDto,
      createdBy: req.user.id,
      tenantId: Number.parseInt(tenantId),
    });
  }

  @Get()
  findAll(@Query() query: GetAllNotesRequest) {
    return this.notesService.getAllNotes(query);
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
