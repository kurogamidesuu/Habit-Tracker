import { apiClient } from "../lib/apiClient";

export interface Habit {
  id: string;
  title: string;
  currentStreak: number;
  maxStreak: number;
  isComplete: boolean;
}

export interface HabitLog {
  id: number;
  dateString: string;
  createdAt: string;
}

export interface HabitWithAnalytics extends Habit {
  createdAt: string;
  completions: HabitLog[];
}

export const fetchHabits = async (
  token: string | null,
  setAccessToken: (token: string | null) => void,
) => {
  const today = new Date().toLocaleDateString('en-CA');

  const data = await apiClient(
    `/habits?today=${today}`,
    { method: 'GET' },
    token,
    setAccessToken
  );

  return data.allHabits as Habit[];
}

export const addHabit = async (
  title: string,
  token: string | null,
  setAccessToken: (token: string | null) => void,
) => {
  if (!title) return "Please enter a title for the habit!";

  const data = await apiClient(
    `/habits/add`,
    {
      method: 'POST',
      body: JSON.stringify({ title }),
    },
    token,
    setAccessToken,
  );

  return data.message;
}

export const deleteHabit = async (
  id: string,
  token: string | null,
  setAccessToken: (token: string | null) => void,
) => {
  const data = await apiClient(
    `/habits/remove`,
    {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    },
    token,
    setAccessToken
  );

  return data.message;
}

export const completeHabit = async (
  id: string,
  dateString: string,
  token: string | null,
  setAccessToken: (token: string | null) => void,
) => {
  const data = await apiClient(
    `/habits/complete`,
    {
      method: 'PATCH',
      body: JSON.stringify({ id, dateString }),
    },
    token,
    setAccessToken,
  );

  return data;
}

export const fetchHabitAnalytics = async (
  id: string,
  token: string | null,
  setAccessToken: (token: string | null) => void,
): Promise<HabitWithAnalytics> => {
  const data = await apiClient(
    `/habits/${id}/analytics`,
    { method: 'GET' },
    token,
    setAccessToken,
  );

  return data.habit;
}