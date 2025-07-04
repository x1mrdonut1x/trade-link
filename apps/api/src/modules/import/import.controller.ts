import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ImportProcessRequest,
  ImportExecuteRequest,
  ImportPreviewResponse,
  ImportExecuteResponse,
} from '@tradelink/shared';

import { ImportService } from './import.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('import')
@UseGuards(JwtAuthGuard)
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('process')
  @HttpCode(HttpStatus.OK)
  async processImport(
    @Body() body: ImportProcessRequest,
  ): Promise<ImportPreviewResponse> {
    return this.importService.processImport(body);
  }

  @Post('execute')
  @HttpCode(HttpStatus.OK)
  async executeImport(
    @Body() body: ImportExecuteRequest,
  ): Promise<ImportExecuteResponse> {
    return this.importService.executeImport(body);
  }

  @Get('template/:type')
  async downloadTemplate(
    @Param('type') type: string,
    @Res() res: Response,
  ): Promise<void> {
    const template = await this.importService.generateTemplate(type);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${type}_template.csv"`,
    );
    res.send(template);
  }
}
