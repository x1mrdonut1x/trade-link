import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateTodoRequest, GetAllTodosQueryRequest, UpdateTodoRequest } from '@tradelink/shared';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { TodosService } from './todos.service';

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoRequest, @Request() req) {
    return this.todosService.createTodo({
      ...createTodoDto,
      createdBy: req.user.id,
    });
  }

  @Get()
  findAll(@Query() query: GetAllTodosQueryRequest) {
    return this.todosService.getAllTodos({
      status: query.status,
      contactId: query.contactId,
      companyId: query.companyId,
    });
  }

  @Get('contact/:contactId')
  findByContactId(@Param('contactId', ParseIntPipe) contactId: number) {
    return this.todosService.getTodosByContactId(contactId);
  }

  @Get('company/:companyId')
  findByCompanyId(@Param('companyId', ParseIntPipe) companyId: number) {
    return this.todosService.getTodosByCompanyId(companyId);
  }

  @Patch(':id/resolve')
  resolve(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.resolveTodo(id);
  }

  @Patch(':id/unresolve')
  unresolve(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.unresolveTodo(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.getTodoById(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTodoDto: UpdateTodoRequest) {
    return this.todosService.updateTodo(id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.deleteTodo(id);
  }
}
