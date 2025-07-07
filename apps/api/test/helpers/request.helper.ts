import queryString from 'query-string';
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
  get: <T>(url: string, query?: Record<string, unknown>) => Promise<T>;
  post: <T>(url: string, data?: any) => Promise<T>;
  put: <T>(url: string, data?: any) => Promise<T>;
  delete: <T>(url: string) => Promise<T>;
  patch: <T>(url: string, data?: any) => Promise<T>;
}

export const authRequest = (token: string): RequestHelper => {
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
      const search = queryString.stringify(query, { arrayFormat: 'comma' });
      req = req.query(search);
    }

    req = req.set('Authorization', `Bearer ${token || globalAuthToken}`);

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      req = req.send(data);
    }

    const response = await req;

    // Check if the response indicates an error
    if (response.status >= 400) {
      throw new Error(response.body);
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
