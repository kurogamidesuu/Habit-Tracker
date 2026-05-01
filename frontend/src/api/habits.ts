import { Preferences } from "@capacitor/preferences";

export interface Habit {
  id: number;
  title: string;
  streak: number;
  isComplete: boolean;
}

export const fetchHabits = async () => {
  const { value: token } = await Preferences.get({ key: 'habit-token' });

  const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/habits`, {
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
  
  return data.allHabits as Habit[];
}

export const deleteHabit = async (id: number) => {
  const { value: token } = await Preferences.get({ key: 'habit-token' });

  const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/habits/remove`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id }),
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}