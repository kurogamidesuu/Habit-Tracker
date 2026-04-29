import { Preferences } from "@capacitor/preferences";

export interface User {
  id: number;
  username: string;
  email: string;
}

export const getUser = async () => {
  const { value: token } = await Preferences.get({ key: 'habit-token' });

  const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data.user as User;
}