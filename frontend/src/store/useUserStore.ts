import { create } from "zustand";
import { getUser } from "../api/user";

interface UserState {
  username: string;
  isLoadingUser: boolean;
  getUserDetails: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  username: "",
  isLoadingUser: false,

  getUserDetails: async () => {
    set({ isLoadingUser: true });
    try {
      const user = await getUser();
      set({ username: user.username, isLoadingUser: false });
    } catch (e) {
      console.error('Failed to fetch user:', e);
      set({ isLoadingUser: false });
    }
  }
}));