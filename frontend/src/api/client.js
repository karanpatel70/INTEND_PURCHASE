// Owner: Manvendra. Every API call goes through this one function.
const BASE = import.meta.env.VITE_API_URL;
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export async function api(path, options = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}
