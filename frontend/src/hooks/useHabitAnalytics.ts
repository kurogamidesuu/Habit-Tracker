import { useQuery } from "@tanstack/react-query"
import { fetchHabitAnalytics } from "../api/habits"
import { calculateAnalytics } from "../lib/analytics";

export const useHabitAnalytics = (habitId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', habitId],
    queryFn: () => fetchHabitAnalytics(habitId),
    staleTime: 1000 * 60 * 5,
  });

  const analytics = data ? calculateAnalytics(data) : null;

  return { analytics, habit: data, isLoading, error };
}