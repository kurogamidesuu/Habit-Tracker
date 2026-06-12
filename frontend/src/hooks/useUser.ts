import { useQuery } from "@tanstack/react-query"
import { getUser } from "../api/user"
import { useAuth } from "./useAuth"

export const USER_KEY = ['user']

export const useUser = () => {
  const { accessToken, setAccessToken } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: USER_KEY,
    queryFn: () => getUser(accessToken, setAccessToken),
  });

  return {
    username: data?.username ?? '',
    hasPassword: data?.hasPassword ?? false,
    isLoadingUser: isLoading,
    notificationsEnabled: data?.notificationsEnabled,
    streakWarningEnabled: data?.streakWarningEnabled,
    dailyReminderTime: data?.dailyReminderTime,
  }
}