import { create } from "zustand";
import { addHabit, completeHabit, deleteHabit, fetchHabits, type Habit } from "../api/habits";

interface HabitState {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;

  getAllHabits: () => Promise<void>;
  addNewHabit: (title: string) => Promise<void>;
  removeHabit: (id: string) => Promise<void>;
  markHabitComplete: (id: string, dateString: string) => Promise<void>;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  isLoading: false,
  error: null,

  getAllHabits: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchHabits();
      set({ habits: data, isLoading: false });
    } catch (e) {
      if (e instanceof Error) {
        set({ error: e.message, isLoading: false });
      }
    }
  },

  addNewHabit: async (title: string) => {
    await addHabit(title);
    get().getAllHabits();
  },

  removeHabit: async (id: string) => {
    set((state) => ({
      habits: state.habits.filter(h => h.id !== id)
    }));

    try {
      await deleteHabit(id);
    } catch(e) {
      get().getAllHabits();
      throw e;
    }
  },

  markHabitComplete: async (id, dateString) => {
    set((state) => ({
      habits: state.habits.map((h) => 
        h.id === id ? {
          ...h,
          isComplete: true,
          currentStreak: h.currentStreak + 1,
          maxStreak: Math.max(h.maxStreak, h.currentStreak + 1),
        } : h
      )
    }));

    try {
      await completeHabit(id, dateString);
    } catch (e) {
      console.error("Failed to save to DB", e);
      get().getAllHabits();
    }
  }
}));