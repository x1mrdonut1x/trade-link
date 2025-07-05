import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import {
  ImportExecuteResponse,
  ImportFieldMappings,
  ImportPreviewResponse,
  ImportType,
  type ImportExecuteRequest,
} from '@tradelink/shared';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ImportService } from './import.service';

type FromFormData<T> = {
  [K in keyof T]: string;
};

@Controller('import')
@UseGuards(JwtAuthGuard)
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('process')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('csvFile'))
  async processImport(
    @UploadedFile() csvFile: Express.Multer.File,
    @Body() body: { fieldMappings: string; importType: string }
  ): Promise<ImportPreviewResponse> {
    // Parse the JSON strings from the form data
    const fieldMappings = JSON.parse(body.fieldMappings);
    const importType = body.importType as ImportType;

    return this.importService.processImport({ fieldMappings, importType }, csvFile);
  }

  @Post('execute')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(AnyFilesInterceptor())
  async executeImport(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: FromFormData<ImportExecuteRequest>
  ): Promise<ImportExecuteResponse> {
    // Parse the JSON strings from the form data
    const fieldMappings = JSON.parse(body.fieldMappings) as ImportFieldMappings;
    const importType = body.importType as ImportType;
    const skippedCompanyRows = body.skippedCompanyRows ? JSON.parse(body.skippedCompanyRows) : undefined;
    const skippedContactRows = body.skippedContactRows ? JSON.parse(body.skippedContactRows) : undefined;

    // Extract specific files from the files array
    const companyCsvFile = files.find(file => file.fieldname === 'companyCsvFile');
    const contactCsvFile = files.find(file => file.fieldname === 'contactCsvFile');

    return this.importService.executeImportWithCsv(
      {
        fieldMappings,
        importType,
        skippedCompanyRows,
        skippedContactRows,
      },
      companyCsvFile,
      contactCsvFile
    );
  }
}
