export const login = async (email: string, password: string) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  return await res.json();
}

export const signup = async (username: string, email: string, password: string) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/signup`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  return await res.json();
}