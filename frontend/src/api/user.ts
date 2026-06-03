import { apiClient } from "../lib/apiClient";

export interface User {
  id: number;
  username: string;
  email: string;
  notificationsEnabled: boolean;
  streakWarningEnabled: boolean;
  dailyReminderTime: string;
}

export const getUser = async (
  token: string | null,
  setAccessToken: (token: string | null) => void,
) => {
  const data = await apiClient(
    `/user/profile`,
    { method: 'GET' },
    token,
    setAccessToken,
  );

  return data.user as User;
}

export const updateUserPreferences = async (
  preferences: Partial<Omit<User, 'id' | 'username' | 'email'>>,
  token: string | null,
  setAccessToken: (token: string | null) => void,
) => {
  const data = await apiClient(
    `/user/preferences`, 
    {
      method: 'PUT',
      body: JSON.stringify(preferences)
    },
    token,
    setAccessToken,
  );

  return data;
}