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

export const fetchHabits = async () => {
  const token = localStorage.getItem('habit-token');

  if (!token) {
    throw new Error('Not authenticated');
  }

  const today = new Date().toLocaleDateString('en-CA');

  const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/habits?today=${today}`, {
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

export const addHabit = async (title: string) => {
  if (!title) return "Please enter a title for the habit!";

  const token = localStorage.getItem('habit-token');

  if (!token) {
    throw new Error('Not authenticated');
  }
  
  const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/habits/add`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({title}),
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data.message;
}

export const deleteHabit = async (id: string) => {
  const token = localStorage.getItem('habit-token');

  if (!token) {
    throw new Error('Not authenticated');
  }

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

  return data.message;
}

export const completeHabit = async (id: string, dateString: string) => {
  const token = localStorage.getItem('habit-token');

  if (!token) {
    throw new Error('Not authenticated');
  }

  const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/habits/complete`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, dateString }),
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const fetchHabitAnalytics = async (id: string): Promise<HabitWithAnalytics> => {
  const token = localStorage.getItem('habit-token');

  if (!token) {
    throw new Error('Not Authenticated');
  }

  const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/habits/${id}/analytics`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data.habit;
}