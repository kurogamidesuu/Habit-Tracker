export interface User {
  id: number;
  username: string;
  email: string;
  notificationsEnabled: boolean;
  streakWarningEnabled: boolean;
  dailyReminderTime: string;
}

export const getUser = async (token: string | null) => {
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

export const updateUserPreferences = async (preferences: Partial<Omit<User, 'id' | 'username' | 'email'>>, token: string | null) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/preferences`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferences)
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || 'Failed to update preferences');
  }

  return data;
}