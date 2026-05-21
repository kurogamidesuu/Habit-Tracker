import { useNavigate } from "react-router-dom";
import { useHabits } from "../hooks/useHabits";
import { useUser } from "../hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";

const ProfilePage = () => {
  const { username } = useUser();
  const { habits } = useHabits();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const habitsCount = habits.length;
  const bestMaxStreak = habits.reduce((max, habit) => Math.max(max, habit.maxStreak), 0);

  const handleLogout = async () => {
    queryClient.clear();
    localStorage.removeItem('habit-token');
    localStorage.removeItem('tanstack-query-["user"]');
    localStorage.removeItem('tanstack-query-["habits"]');
    navigate('/login');
  }

  return (
    <main className="h-screen w-full md:w-1/2 mx-auto bg-sky-950 text-slate-200 flex flex-col items-center gap-4 py-10 px-2">
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
          className="w-[95%] h-10 bg-red-600/60 rounded-md hover:bg-red-800/70 cursor-pointer duration-200"
        >
          Logout
        </button>
      </div>
    </main>
  )
}

export default ProfilePage