export async function myFetch<T = unknown>(url: string, data?: Omit<globalThis.RequestInit, 'body'> & { body?: unknown }) {
  const headers = new Headers(data?.headers);
  headers.append('Authorization', 'Bearer accessToken');
  headers.append('Content-Type', 'application/json');

  const baseUrl = import.meta.env.API_URL;
  const parsedUrl = `${baseUrl}/${url}`;

  const parsedBody = JSON.stringify(data?.body);

  const response = await fetch(parsedUrl, { ...data, body: parsedBody });

  return response.json() as T;
}
