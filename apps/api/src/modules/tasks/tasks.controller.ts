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
import { CreateTaskRequest, GetAllTasksQueryRequest, UpdateTaskRequest } from '@tradelink/shared';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { TenantAuthGuard } from '../../guards/tenant-auth.guard';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard, TenantAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Headers('tenant-id') tenantId: string, @Body() data: CreateTaskRequest, @Request() req) {
    return this.tasksService.createTask({
      ...data,
      createdBy: req.user.id,
      tenantId: Number.parseInt(tenantId),
    });
  }

  @Get()
  findAll(@Query() query: GetAllTasksQueryRequest) {
    return this.tasksService.getAllTasks({
      status: query.status,
      contactId: query.contactId,
      companyId: query.companyId,
    });
  }

  @Get('contact/:contactId')
  findByContactId(@Param('contactId', ParseIntPipe) contactId: number) {
    return this.tasksService.getAllTasks({ contactId });
  }

  @Get('company/:companyId')
  findByCompanyId(@Param('companyId', ParseIntPipe) companyId: number) {
    return this.tasksService.getAllTasks({ companyId });
  }

  @Patch(':id/resolve')
  resolve(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.resolveTask(id);
  }

  @Patch(':id/unresolve')
  unresolve(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.unresolveTask(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.getTaskById(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskRequest) {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.deleteTask(id);
  }
}
