import { useQuery } from "@tanstack/react-query"
import { fetchHabitAnalytics } from "../api/habits"
import { calculateAnalytics } from "../lib/analytics";
import { useAuth } from "./useAuth";

export const useHabitAnalytics = (habitId: string) => {
 const { accessToken, setAccessToken } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', habitId],
    queryFn: () => fetchHabitAnalytics(habitId, accessToken, setAccessToken),
    staleTime: 1000 * 60 * 5,
  });

  const analytics = data ? calculateAnalytics(data) : null;

  return { analytics, habit: data, isLoading, error };
}