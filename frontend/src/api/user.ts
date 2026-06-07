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

export const changeUsername = async (
  newUsername: string,
  token: string | null,
  setAccessToken: (token: string | null) => void,
) => {
  const data = await apiClient(
    '/user/username',
    {
      method: 'PATCH',
      body: JSON.stringify({ newUsername }),
    },
    token,
    setAccessToken
  );

  return data;
}

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  token: string | null,
  setAccessToken: (token: string | null) => void,
) => {
  const data = await apiClient(
    '/user/password',
    {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword }),
    },
    token,
    setAccessToken,
  );

  return data;
}

export const deleteAccount = async (
  confirmationMessage: string,
  token: string | null,
  setAccessToken: (token: string | null) => void,
) => {
  if (confirmationMessage !== "CONFIRM") {
    throw new Error();
  }

  const data = await apiClient(
    '/user/delete',
    {
      method: 'DELETE',
    },
    token,
    setAccessToken,
  );

  return data;
}