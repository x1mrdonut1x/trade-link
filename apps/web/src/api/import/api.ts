import type {
  ImportExecuteRequest,
  ImportExecuteResponse,
  ImportPreviewResponse,
  ImportProcessRequest,
} from '@tradelink/shared';
import { myFetch } from 'api/client';

export const importAPI = {
  async processImport(body: ImportProcessRequest & { csvFile: Blob }) {
    const formData = new FormData();
    formData.append('csvFile', body.csvFile);
    formData.append('fieldMappings', JSON.stringify(body.fieldMappings));
    formData.append('importType', body.importType);

    return myFetch<ImportPreviewResponse>('import/process', {
      method: 'POST',
      body: formData,
    });
  },

  async executeImport(body: ImportExecuteRequest & { companyCsvFile?: Blob; contactCsvFile?: Blob }) {
    const formData = new FormData();
    formData.append('fieldMappings', JSON.stringify(body.fieldMappings));
    formData.append('importType', body.importType);

    if (body.skippedCompanyRows) {
      formData.append('skippedCompanyRows', JSON.stringify(body.skippedCompanyRows));
    }

    if (body.skippedContactRows) {
      formData.append('skippedContactRows', JSON.stringify(body.skippedContactRows));
    }

    if (body.companyCsvFile) {
      formData.append('companyCsvFile', body.companyCsvFile);
    }

    if (body.contactCsvFile) {
      formData.append('contactCsvFile', body.contactCsvFile);
    }

    return myFetch<ImportExecuteResponse>('import/execute', {
      method: 'POST',
      body: formData,
    });
  },
};
