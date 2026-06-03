import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addHabit, completeHabit, deleteHabit, fetchHabits, type Habit } from "../api/habits";
import { useAuth } from "./useAuth";

export const HABITS_KEY = ['habits']

export const useHabits = () => {
  const queryClient = useQueryClient();
  const { accessToken } = useAuth();

  const { data: habits = [], isLoading, error } = useQuery({
    queryKey: HABITS_KEY,
    queryFn: () => fetchHabits(accessToken),
  });

  const addNewHabit = useMutation({
    mutationFn:(title: string) => addHabit(title, accessToken),
    onSettled: () => queryClient.invalidateQueries({ queryKey: HABITS_KEY })
  });

  const removeHabit = useMutation({
    mutationFn: (id: string) => deleteHabit(id, accessToken),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: HABITS_KEY });
      const previousHabits = queryClient.getQueryData<Habit[]>(HABITS_KEY);
      queryClient.setQueryData<Habit[]>(HABITS_KEY, old => old?.filter(h => h.id !== id) ?? []);

      return { previousHabits }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(HABITS_KEY, context?.previousHabits)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: HABITS_KEY })
  });

  const markHabitComplete = useMutation({
    mutationFn: ({ id, dateString }: { id: string, dateString: string }) => completeHabit(id, dateString, accessToken),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: HABITS_KEY });
      const previousHabits = queryClient.getQueryData<Habit[]>(HABITS_KEY);
      queryClient.setQueryData<Habit[]>(HABITS_KEY, old => old?.map(h => h.id === id ? {
        ...h,
        isComplete: true,
        currentStreak: h.currentStreak + 1,
        maxStreak: Math.max(h.maxStreak, h.currentStreak + 1),
      } : h) ?? []);

      return { previousHabits }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(HABITS_KEY, context?.previousHabits)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: HABITS_KEY})
  });

  return {
    habits,
    isLoading,
    error,
    addNewHabit,
    removeHabit,
    markHabitComplete,
  }
}