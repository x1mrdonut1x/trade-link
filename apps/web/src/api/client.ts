import queryString from 'query-string';

export async function myFetch<T = unknown>(
  url: string,
  data?: Omit<globalThis.RequestInit, 'body'> & { body?: unknown; query?: Record<string, unknown> }
): Promise<T> {
  const headers = new Headers(data?.headers);
  headers.append('Authorization', 'Bearer accessToken');
  headers.append('Content-Type', 'application/json');

  const baseUrl = import.meta.env.VITE_API_URL;

  const parsedUrl = new URL(`${baseUrl}/${url}`);
  parsedUrl.search = new URLSearchParams(queryString.stringify(data?.query || {})).toString();

  const parsedBody = JSON.stringify(data?.body);

  if (data?.method !== 'GET') {
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  const response = await fetch(parsedUrl, { ...data, headers, body: parsedBody });

  return response.json() as T;
}
