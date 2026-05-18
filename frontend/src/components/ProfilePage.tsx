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
  const bestMaxStreak = habits.reduce((max, habit) => Math.max(max, habit.maxStreak), 0);

  const handleLogout = async () => {
    location.replace('/login');
    localStorage.removeItem('habit-token');
  }

  return (
    <main className="h-screen w-full bg-sky-950 text-slate-200 flex flex-col items-center gap-4 py-10 px-2">
      <h1 className="text-3xl font-bold">Your Profile</h1>
      <div className="flex flex-col items-center gap-1">
        <img src="/pfp.png" alt="profile picture" className="h-35 w-35" />
        <h2 className="text-xl text-amber-400 font-semibold">{username}</h2>
      </div>
      
      <fieldset className="bg-sky-400/30 w-[95%] px-2 py-4 rounded-lg border-2 border-amber-400">
        <legend className="text-[1.1em] font-bold text-amber-400">Overall Stats</legend>
        <p>Total habits: {habitsCount}</p>
        <p>Best single streak: {bestMaxStreak}</p>
      </fieldset>

      <div className="w-[95%] flex flex-col items-center">
        <button
          onClick={handleLogout}
          className="w-[95%] h-10 bg-red-600/60 rounded-md hover:bg-red-800/70"
        >
          Logout
        </button>
      </div>
    </main>
  )
}

export default ProfilePage