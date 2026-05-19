import { useQuery } from "@tanstack/react-query"
import { getUser } from "../api/user"

export const USER_KEY = ['user']

export const useUser = () => {
  const { data, isLoading } = useQuery({
    queryKey: USER_KEY,
    queryFn: getUser,
  });

  return {
    username: data?.username ?? '',
    isLoadingUser: isLoading,
  }
}