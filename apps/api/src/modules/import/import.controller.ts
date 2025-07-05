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
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ImportExecuteResponse, ImportFieldMappings, ImportPreviewResponse, ImportType } from '@tradelink/shared';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ImportService } from './import.service';

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
  @UseInterceptors(FilesInterceptor('companyCsvFile,contactCsvFile'))
  async executeImport(
    @UploadedFiles() files: { companyCsvFile?: any; contactCsvFile?: any },
    @Body()
    body: {
      fieldMappings: string;
      importType: string;
      selectedCompanyRows?: string;
      selectedContactRows?: string;
    }
  ): Promise<ImportExecuteResponse> {
    // Parse the JSON strings from the form data
    const fieldMappings = JSON.parse(body.fieldMappings) as ImportFieldMappings;
    const importType = body.importType as ImportType;
    const selectedCompanyRows = body.selectedCompanyRows ? JSON.parse(body.selectedCompanyRows) : undefined;
    const selectedContactRows = body.selectedContactRows ? JSON.parse(body.selectedContactRows) : undefined;

    return this.importService.executeImportWithCsv(
      {
        fieldMappings,
        importType,
        selectedCompanyRows,
        selectedContactRows,
      },
      files.companyCsvFile,
      files.contactCsvFile
    );
  }
}
