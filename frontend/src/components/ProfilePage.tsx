import { useNavigate } from "react-router-dom";
import { useHabits } from "../hooks/useHabits";
import { useUser } from "../hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";
import { FaSignOutAlt, FaTrophy, FaChartLine, FaCog, FaBell, FaChevronRight } from "react-icons/fa";

const ProfilePage = () => {
  const { username } = useUser();
  const { habits } = useHabits();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const habitsCount = habits.length;
  const bestMaxStreak = habits.reduce((max, habit) => Math.max(max, habit.maxStreak), 0);
  
  // const totalMomentum = habits.reduce((sum, habit) => sum + habit.currentStreak, 0);

  const handleLogout = async () => {
    queryClient.clear();
    localStorage.removeItem('habit-token');
    localStorage.removeItem('tanstack-query-["user"]');
    localStorage.removeItem('tanstack-query-["habits"]');
    navigate('/login');
  }

  return (
    <main className="h-screen w-full md:w-1/2 mx-auto bg-sky-950 text-sky-50 flex flex-col items-center pt-8 px-4 pb-[88px] overflow-hidden relative">
      <h1 className="text-xl font-semibold my-2 tracking-wide shrink-0">
        Account & Settings
      </h1>

      <div className="flex-1 w-full max-w-md flex flex-col gap-6 overflow-y-auto pr-1 pb-4 mt-2">
        
        {/* Identity Card */}
        <div className="bg-sky-900/30 border border-sky-800/40 rounded-2xl p-6 flex flex-col items-center shadow-lg shadow-sky-950/40 shrink-0">
          <div className="h-24 w-24 rounded-full border-4 border-sky-800/60 overflow-hidden mb-4 bg-sky-950 shadow-inner flex items-center justify-center">
            <img src="/pfp.png" alt="profile picture" className="h-full w-full object-cover" />
          </div>
          <h2 className="text-2xl text-sky-100 font-bold tracking-tight">{username || "User"}</h2>
          <p className="text-sm text-sky-400/60 font-medium mt-1">Kintsugi Member</p>
        </div>

        {/* Lifetime Stats Grid */}
        <div className="shrink-0">
          <h3 className="text-[11px] text-sky-400 uppercase tracking-widest font-semibold mb-3 px-1">
            Lifetime Statistics
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-sky-900/20 p-4 rounded-xl border border-sky-800/30 flex flex-col items-center text-center shadow-sm">
              <FaChartLine className="text-sky-400/70 text-lg mb-2" />
              <p className="text-2xl font-bold text-sky-100">{habitsCount}</p>
              <p className="text-[10px] text-sky-400 uppercase tracking-wider mt-1">Tracked Habits</p>
            </div>
            
            <div className="bg-sky-900/20 p-4 rounded-xl border border-amber-900/30 flex flex-col items-center text-center shadow-sm">
              <FaTrophy className="text-amber-400/80 text-lg mb-2" />
              <p className="text-2xl font-bold text-amber-400">{bestMaxStreak}</p>
              <p className="text-[10px] text-amber-500/80 uppercase tracking-wider mt-1">Best Streak</p>
            </div>
          </div>
        </div>

        {/* Preferences Menu */}
        <div className="shrink-0">
          <h3 className="text-[11px] text-sky-400 uppercase tracking-widest font-semibold mb-3 px-1">
            Preferences
          </h3>
          <div className="bg-sky-900/20 border border-sky-800/30 rounded-xl flex flex-col overflow-hidden shadow-sm">
            
            {/* Mock Setting 1 */}
            <div className="flex items-center justify-between p-4 border-b border-sky-800/30 hover:bg-sky-900/40 cursor-pointer transition-colors group">
              <div className="flex items-center gap-3">
                <FaBell className="text-sky-400/80 group-hover:text-sky-300 transition-colors" />
                <span className="text-sm text-sky-100 font-medium">Notifications</span>
              </div>
              <span className="text-[10px] text-lime-400 bg-lime-900/20 px-2 py-0.5 rounded border border-lime-800/30 font-semibold tracking-wide">
                Enabled
              </span>
            </div>
            
            {/* Mock Setting 2 */}
            <div className="flex items-center justify-between p-4 hover:bg-sky-900/40 cursor-pointer transition-colors group">
              <div className="flex items-center gap-3">
                <FaCog className="text-sky-400/80 group-hover:text-sky-300 transition-colors" />
                <span className="text-sm text-sky-100 font-medium">Account Settings</span>
              </div>
              <FaChevronRight className="text-sky-500/50 text-xs group-hover:text-sky-400 transition-colors" />
            </div>

          </div>
        </div>

        {/* Logout Action */}
        <div className="mt-4 mb-6 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 h-12 bg-red-950/30 border border-red-900/50 rounded-xl text-red-400 font-medium hover:bg-red-900/50 hover:text-red-300 hover:border-red-700/50 transition-all duration-200 shadow-sm"
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </main>
  )
}

export default ProfilePage