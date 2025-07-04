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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {
  ImportExecuteRequest,
  ImportPreviewResponse,
  ImportExecuteResponse,
  ImportType,
} from '@tradelink/shared';

import { ImportService } from './import.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('import')
@UseGuards(JwtAuthGuard)
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('process')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('csvFile'))
  async processImport(
    @UploadedFile() csvFile: any,
    @Body() body: { fieldMappings: string; importType: string },
  ): Promise<ImportPreviewResponse> {
    // Parse the JSON strings from the form data
    const fieldMappings = JSON.parse(body.fieldMappings);
    const importType = body.importType as ImportType;

    return this.importService.processImport(
      { fieldMappings, importType },
      csvFile,
    );
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
