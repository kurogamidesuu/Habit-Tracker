import { useEffect } from "react";
import { useUserStore } from "../store/useUserStore";
import { useHabitStore } from "../store/useHabitStore";

const ProfilePage = () => {
  const { getUserDetails, username } = useUserStore();
  const { habits } = useHabitStore();

  useEffect(() => {
    getUserDetails();
  }, [getUserDetails]);

  const habitsCount = habits.length;

  return (
    <main className="h-screen w-full bg-sky-950 text-slate-200 flex flex-col items-center py-10 px-2">
      <h1 className="text-3xl font-bold">Your Profile</h1>
      <h2 className="text-xl text-amber-400 font-semibold">{username}</h2>
      <p>Total habits: {habitsCount}</p>
    </main>
  )
}

export default ProfilePage