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
  findAll(@Headers('tenant-id') tenantId: string, @Query() query: GetAllNotesRequest) {
    return this.notesService.getAllNotes(Number.parseInt(tenantId), query);
  }

  @Get(':id')
  findOne(@Headers('tenant-id') tenantId: string, @Param('id', ParseIntPipe) id: number) {
    return this.notesService.getNoteById(Number.parseInt(tenantId), id);
  }

  @Patch(':id')
  update(
    @Headers('tenant-id') tenantId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteRequest
  ) {
    return this.notesService.updateNote(Number.parseInt(tenantId), id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Headers('tenant-id') tenantId: string, @Param('id', ParseIntPipe) id: number) {
    return this.notesService.deleteNote(Number.parseInt(tenantId), id);
  }
}
