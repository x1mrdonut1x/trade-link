import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
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
@UseGuards(JwtAuthGuard)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async getAllTags(@Query() query: GetAllTagsQuery): Promise<GetAllTagsResponse> {
    return this.tagsService.getAllTags(query);
  }

  @Get(':id')
  async getTag(@Param('id', ParseIntPipe) id: number): Promise<GetTagResponse> {
    return this.tagsService.getTag(id);
  }

  @Post()
  async createTag(@Body() createTagDto: CreateTagRequest, @Request() req: any): Promise<CreateTagResponse> {
    const userId = req.user.id;
    return this.tagsService.createTag(createTagDto, userId);
  }

  @Put(':id')
  async updateTag(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagRequest
  ): Promise<UpdateTagResponse> {
    return this.tagsService.updateTag(id, updateTagDto);
  }

  @Delete(':id')
  async deleteTag(@Param('id', ParseIntPipe) id: number): Promise<DeleteTagResponse> {
    return this.tagsService.deleteTag(id);
  }
}
