import request from 'supertest';
import { getTestApp } from '../setupFilesAfterEnv';

let globalAuthToken: string | null = null;
let globalTenantId: number | null = null;

export const setTestAuthToken = (token: string) => {
  globalAuthToken = token;
};

export const clearTestAuthToken = () => {
  globalAuthToken = null;
};

export const setTestTenantId = (tenantId: number) => {
  globalTenantId = tenantId;
};

export const getGlobalTenantId = () => {
  return globalTenantId;
};

export const clearTestTenantId = () => {
  globalTenantId = null;
};

interface RequestHelper {
  get: <T>(url: string, query?: Record<string, unknown>) => Promise<T>;
  post: <T>(url: string, data?: any) => Promise<T>;
  put: <T>(url: string, data?: any) => Promise<T>;
  delete: <T>(url: string) => Promise<T>;
  patch: <T>(url: string, data?: any) => Promise<T>;
}

export const authRequest = (token?: string): RequestHelper => {
  const app = getTestApp();
  const baseRequest = request(app.getHttpServer());

  const makeRequest = async (
    method: string,
    url: string,
    data?: any,
    query?: Record<string, unknown>
  ): Promise<any> => {
    let req = baseRequest[method.toLowerCase()](url);

    if (query) {
      const search = new URLSearchParams(query as any).toString();
      req = req.query(search);
    }

    req = req.set('Authorization', `Bearer ${token || globalAuthToken}`);
    if (globalTenantId) req = req.set('tenant-id', globalTenantId.toString());

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      req = req.send(data);
    }

    const response = await req;

    // Check if the response indicates an error
    if (response.status >= 400) {
      console.error(response.body);
      throw new Error(response.body.message || 'Request failed');
    }

    return response.body;
  };

  return {
    get: (url: string, query?: Record<string, unknown>) => makeRequest('GET', url, undefined, query),
    post: (url: string, data?: any) => makeRequest('POST', url, data),
    put: (url: string, data?: any) => makeRequest('PUT', url, data),
    delete: (url: string) => makeRequest('DELETE', url),
    patch: (url: string, data?: any) => makeRequest('PATCH', url, data),
  };
};
