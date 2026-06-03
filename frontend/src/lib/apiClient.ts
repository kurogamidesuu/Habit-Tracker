export const apiClient = async (
  endpoint: string,
  options: RequestInit,
  accessToken: string | null,
  setAccessToken: (token: string | null) => void,
) => {
  if (!accessToken) {
    throw new Error('Not Authenticated');
  }

  const url = `${import.meta.env.VITE_BACKEND_BASE_URL}${endpoint}`;

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${accessToken}`);
  headers.set('Content-Type', 'application/json')

  const config: RequestInit = {
    ...options,
    headers,
    body: options.body,
  };

  let res = await fetch(url, config);

  if (res.status === 401) {
    try {
      const refreshRes = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      const refreshData = await refreshRes.json();

      if (refreshData.success && refreshData.token) {
        setAccessToken(refreshData.token);
        headers.set('Authorization', `Bearer ${refreshData.token}`);
        res = await fetch(url, { ...config, headers });
      } else {
        setAccessToken(null);
        throw new Error('Session expired. Please log in again');
      }
    } catch {
      setAccessToken(null);
      throw new Error('Session expired. Please log in again');
    }
  }

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}