import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { TenantAuthGuard } from '../../guards/tenant-auth.guard';
import { TagsService } from './tags.service';

import {
  CreateTagRequest,
  CreateTagResponse,
  DeleteTagResponse,
  GetAllTagsQuery,
  GetAllTagsResponse,
  GetTagResponse,
  UpdateTagRequest,
  UpdateTagResponse,
} from '@tradelink/shared';

@Controller('tags')
@UseGuards(JwtAuthGuard, TenantAuthGuard)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async getAllTags(
    @Headers('tenant-id') tenantId: string,
    @Query() query: GetAllTagsQuery
  ): Promise<GetAllTagsResponse> {
    return this.tagsService.getAllTags(Number.parseFloat(tenantId), query);
  }

  @Get(':id')
  async getTag(@Headers('tenant-id') tenantId: string, @Param('id', ParseIntPipe) id: number): Promise<GetTagResponse> {
    return this.tagsService.getTag(Number.parseInt(tenantId), id);
  }

  @Post()
  async createTag(
    @Headers('tenant-id') tenantId: string,
    @Body() createTagDto: CreateTagRequest,
    @Request() req: any
  ): Promise<CreateTagResponse> {
    const userId = req.user.id;
    return this.tagsService.createTag(createTagDto, userId, Number.parseInt(tenantId));
  }

  @Put(':id')
  async updateTag(
    @Headers('tenant-id') tenantId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagRequest
  ): Promise<UpdateTagResponse> {
    return this.tagsService.updateTag(Number.parseInt(tenantId), id, updateTagDto);
  }

  @Delete(':id')
  async deleteTag(
    @Headers('tenant-id') tenantId: string,
    @Param('id', ParseIntPipe) id: number
  ): Promise<DeleteTagResponse> {
    return this.tagsService.deleteTag(Number.parseInt(tenantId), id);
  }
}
