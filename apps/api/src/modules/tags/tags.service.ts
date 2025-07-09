import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import type {
  CreateTagRequest,
  CreateTagResponse,
  DeleteTagResponse,
  GetAllTagsQuery,
  GetAllTagsResponse,
  GetTagResponse,
  UpdateTagRequest,
  UpdateTagResponse,
} from '@tradelink/shared';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async getAllTags(tenantId: number, query: GetAllTagsQuery): Promise<GetAllTagsResponse> {
    const { page, size, sortBy, sortOrder } = query;

    const tags = await this.prisma.tag.findMany({
      where: { tenantId },
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: { _count: { select: { companies: true, contacts: true } } },
      take: size,
      skip: (page - 1) * size,
    });

    return tags;
  }

  async getTag(tenantId: number, id: number): Promise<GetTagResponse> {
    const tag = await this.prisma.tag.findUniqueOrThrow({
      where: { tenantId, id },
    });

    return tag;
  }

  async createTag(data: CreateTagRequest, createdBy: number, tenantId: number): Promise<CreateTagResponse> {
    const tag = await this.prisma.tag.create({
      data: {
        ...data,
        createdBy,
        tenantId,
      },
    });

    return tag;
  }

  async updateTag(tenantId: number, id: number, data: UpdateTagRequest): Promise<UpdateTagResponse> {
    const tag = await this.prisma.tag.update({
      where: { tenantId, id },
      data,
    });

    return tag;
  }

  async deleteTag(tenantId: number, id: number): Promise<DeleteTagResponse> {
    await this.prisma.tag.delete({
      where: { tenantId, id },
    });

    return {
      success: true,
      message: 'Tag deleted successfully',
    };
  }
}
