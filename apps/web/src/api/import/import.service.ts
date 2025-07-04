import type { ImportExecuteRequest, ImportExecuteResponse, ImportPreviewResponse } from '@tradelink/shared';
import { myFetch } from 'api/client';

export const importAPI = {
  async processImport(body: { fieldMappings: any; importType: any; csvFile: File }) {
    const formData = new FormData();
    formData.append('csvFile', body.csvFile);
    formData.append('fieldMappings', JSON.stringify(body.fieldMappings));
    formData.append('importType', body.importType);

    return myFetch<ImportPreviewResponse>('import/process', {
      method: 'POST',
      body: formData,
    });
  },

  async executeImport(body: ImportExecuteRequest) {
    return myFetch<ImportExecuteResponse>('import/execute', {
      method: 'POST',
      body,
    });
  },
};
