import type {
  ImportExecuteRequest,
  ImportExecuteResponse,
  ImportPreviewResponse,
  ImportProcessRequest,
} from '@tradelink/shared';
import { myFetch } from 'api/client';

export const importAPI = {
  async processImport(body: ImportProcessRequest) {
    return myFetch<ImportPreviewResponse>('import/process', {
      method: 'POST',
      body,
    });
  },

  async executeImport(body: ImportExecuteRequest) {
    return myFetch<ImportExecuteResponse>('import/execute', {
      method: 'POST',
      body,
    });
  },

  // static async downloadTemplate(type: string) {
  //   const response = await myFetch(`import/template/${type}`);

  //   const blob = await response.blob();
  //   const url = globalThis.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = `${type}_template.csv`;
  //   document.body.append(a);
  //   a.click();
  //   globalThis.URL.revokeObjectURL(url);
  //   a.remove();
  // }
};
