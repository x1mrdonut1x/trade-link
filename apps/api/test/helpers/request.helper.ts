import request from 'supertest';
import { getTestApp } from '../setupFilesAfterEnv';

let globalAuthToken: string | null = null;

export const setAuthToken = (token: string) => {
  globalAuthToken = token;
};

export const clearAuthToken = () => {
  globalAuthToken = null;
};

interface RequestHelper {
  get: (url: string) => Promise<any>;
  post: (url: string, data?: any) => Promise<any>;
  put: (url: string, data?: any) => Promise<any>;
  delete: (url: string) => Promise<any>;
  patch: (url: string, data?: any) => Promise<any>;
}

export const authRequest = (): RequestHelper => {
  const app = getTestApp();
  const baseRequest = request(app.getHttpServer());

  const makeRequest = async (method: string, url: string, data?: any): Promise<any> => {
    let req = baseRequest[method.toLowerCase()](url);

    if (globalAuthToken) {
      req = req.set('Authorization', `Bearer ${globalAuthToken}`);
    }

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      req = req.send(data);
    }

    const response = await req;

    // Check if the response indicates an error
    if (response.status >= 400) {
      const error = new Error(
        `HTTP ${response.status}: ${response.body?.message || response.body?.error || 'Request failed'}`
      );
      (error as any).status = response.status;
      (error as any).response = response.body;
      throw error;
    }

    return response.body;
  };

  return {
    get: (url: string) => makeRequest('GET', url),
    post: (url: string, data?: any) => makeRequest('POST', url, data),
    put: (url: string, data?: any) => makeRequest('PUT', url, data),
    delete: (url: string) => makeRequest('DELETE', url),
    patch: (url: string, data?: any) => makeRequest('PATCH', url, data),
  };
};

// For requests that need specific tokens or no auth
export const requestWithToken = (token: string): RequestHelper => {
  const app = getTestApp();
  const baseRequest = request(app.getHttpServer());

  const makeRequest = async (method: string, url: string, data?: any): Promise<any> => {
    let req = baseRequest[method.toLowerCase()](url);

    if (token) {
      req = req.set('Authorization', `Bearer ${token}`);
    }

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      req = req.send(data);
    }

    const response = await req;

    // Check if the response indicates an error
    if (response.status >= 400) {
      const error = new Error(
        `HTTP ${response.status}: ${response.body?.message || response.body?.error || 'Request failed'}`
      );
      (error as any).status = response.status;
      (error as any).response = response.body;
      throw error;
    }

    return response.body;
  };

  return {
    get: (url: string) => makeRequest('GET', url),
    post: (url: string, data?: any) => makeRequest('POST', url, data),
    put: (url: string, data?: any) => makeRequest('PUT', url, data),
    delete: (url: string) => makeRequest('DELETE', url),
    patch: (url: string, data?: any) => makeRequest('PATCH', url, data),
  };
};
