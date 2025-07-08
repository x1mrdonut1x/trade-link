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
  findAll(@Headers('tenant-id') tenantId: string, @Query() query: GetAllTasksQueryRequest) {
    return this.tasksService.getAllTasks(Number.parseInt(tenantId), {
      status: query.status,
      contactId: query.contactId,
      companyId: query.companyId,
    });
  }

  @Get('contact/:contactId')
  findByContactId(@Headers('tenant-id') tenantId: string, @Param('contactId', ParseIntPipe) contactId: number) {
    return this.tasksService.getAllTasks(Number.parseInt(tenantId), { contactId });
  }

  @Get('company/:companyId')
  findByCompanyId(@Headers('tenant-id') tenantId: string, @Param('companyId', ParseIntPipe) companyId: number) {
    return this.tasksService.getAllTasks(Number.parseInt(tenantId), { companyId });
  }

  @Patch(':id/resolve')
  resolve(@Headers('tenant-id') tenantId: string, @Param('id', ParseIntPipe) id: number) {
    return this.tasksService.resolveTask(Number.parseInt(tenantId), id);
  }

  @Patch(':id/unresolve')
  unresolve(@Headers('tenant-id') tenantId: string, @Param('id', ParseIntPipe) id: number) {
    return this.tasksService.unresolveTask(Number.parseInt(tenantId), id);
  }

  @Get(':id')
  findOne(@Headers('tenant-id') tenantId: string, @Param('id', ParseIntPipe) id: number) {
    return this.tasksService.getTaskById(Number.parseInt(tenantId), id);
  }

  @Patch(':id')
  update(
    @Headers('tenant-id') tenantId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskRequest
  ) {
    return this.tasksService.updateTask(Number.parseInt(tenantId), id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Headers('tenant-id') tenantId: string, @Param('id', ParseIntPipe) id: number) {
    return this.tasksService.deleteTask(Number.parseInt(tenantId), id);
  }
}
