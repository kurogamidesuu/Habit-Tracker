import { useNavigate } from "react-router-dom";
import { useHabits } from "../hooks/useHabits";
import { useUser, USER_KEY } from "../hooks/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserPreferences, type User } from "../api/user";
import { FaSignOutAlt, FaTrophy, FaChartLine, FaCog, FaBell, FaChevronRight, FaExclamationTriangle, FaClock, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";

const ProfilePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showSettings, setShowSettings] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [browserPermission, setBrowserPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [showPermissionHelp, setShowPermissionHelp] = useState(false);

  const { habits } = useHabits();
  const { 
    username, 
    isLoadingUser, 
    notificationsEnabled, 
    streakWarningEnabled, 
    dailyReminderTime 
  } = useUser();
  const { accessToken, setAccessToken } = useAuth();

  const [localTime, setLocalTime] = useState("20:00");
  const [prevDailyReminderTime, setPrevDailyReminderTime] = useState<string | undefined>(undefined);

  if (dailyReminderTime !== prevDailyReminderTime) {
    setLocalTime(dailyReminderTime || "20:00");
    setPrevDailyReminderTime(dailyReminderTime);
  }

  const mutation = useMutation({
    mutationFn: (preferences: Partial<Omit<User, 'id' | 'username' | 'email'>>) => updateUserPreferences(preferences, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEY });
      
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 2000);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save preferences.");
    }
  });

  const habitsCount = habits.length;
  const bestMaxStreak = habits.reduce((max, habit) => Math.max(max, habit.maxStreak), 0);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (!data.success) {
        console.error(data.message || 'Failed to logout');
        toast.error('Failed to logout! Try again.');
        return;
      }
      
      // Clean up application memory and queries
      queryClient.clear();
      localStorage.removeItem('tanstack-query-["user"]');
      localStorage.removeItem('tanstack-query-["habits"]');
      setAccessToken(null);
      navigate('/login');
    } catch (e) {
      console.error('Something went wrong', e);
      toast.error('Failed to logout! Try again.');
    }
  };

  const togglePreference = (key: 'notificationsEnabled' | 'streakWarningEnabled', currentVal: boolean | undefined) => {
    if (mutation.isPending) return;
    mutation.mutate({ [key]: !currentVal });
  };

  const handleNotificationToggle = async () => {
    if (mutation.isPending) return;

    if (browserPermission === 'denied') {
      setShowPermissionHelp(true);
      return;
    }

    if (!notificationsEnabled) {
      if (browserPermission === 'default') {
        const currentPermission = await Notification.requestPermission();
        setBrowserPermission(currentPermission);
        
        if (currentPermission !== 'granted') {
          if (currentPermission === 'denied') setShowPermissionHelp(true);
          return; 
        }
      }
      mutation.mutate({ notificationsEnabled: true });
    } else {
      mutation.mutate({ notificationsEnabled: false });
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setLocalTime(newTime);
    mutation.mutate({ dailyReminderTime: newTime });
  };

  return (
    <main className="h-screen w-full md:w-1/2 mx-auto bg-sky-950 text-sky-50 flex flex-col items-center pt-8 px-4 pb-[88px] overflow-hidden relative">
      
      {/* Floating Status / Confirmation Banner */}
      <div className={`absolute top-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium tracking-wide transition-all duration-300 shadow-md ${
        showSavedToast 
          ? 'opacity-100 translate-y-2 bg-emerald-950/80 border-emerald-500/30 text-emerald-400' 
          : mutation.isPending 
            ? 'opacity-100 translate-y-2 bg-amber-950/80 border-amber-500/30 text-amber-400'
            : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        {mutation.isPending ? (
          <>
            <FaSpinner className="animate-spin" />
            <span>Saving changes...</span>
          </>
        ) : (
          <>
            <FaCheckCircle />
            <span>Preferences saved!</span>
          </>
        )}
      </div>

      <h1 className="text-xl font-semibold my-2 tracking-wide shrink-0">
        Account & Settings
      </h1>

      <div className="flex-1 w-full max-w-md flex flex-col gap-6 overflow-y-auto pr-1 pb-4 mt-2">
        
        {/* Identity Card */}
        <div className="bg-sky-900/30 border border-sky-800/40 rounded-2xl p-6 flex flex-col items-center shadow-lg shadow-sky-950/40 shrink-0">
          <div className="h-24 w-24 rounded-full border-4 border-sky-800/60 overflow-hidden mb-4 bg-sky-950 shadow-inner flex items-center justify-center">
            <img src="/pfp.png" alt="profile picture" className="h-full w-full object-cover" />
          </div>
          <h2 className="text-2xl text-sky-100 font-bold tracking-tight">
            {isLoadingUser ? "..." : (username || "User")}
          </h2>
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
            
            {/* Notification Toggle Control */}
            <div 
              onClick={handleNotificationToggle}
              className="flex items-center justify-between p-4 border-b border-sky-800/30 hover:bg-sky-900/40 cursor-pointer transition-colors group"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <FaBell className={`${browserPermission === 'denied' ? 'text-red-400/80' : 'text-sky-400/80 group-hover:text-sky-300'} transition-colors`} />
                  <span className="text-sm text-sky-100 font-medium">Notifications</span>
                </div>
                
                {/* Show warning indicator */}
                {browserPermission === 'denied' && (
                  <span className="text-[10px] text-red-400 mt-1 ml-7 font-medium tracking-wide">
                    Action required • Tap to fix
                  </span>
                )}
              </div>

              <button 
                type="button"
                aria-label="Toggle Notifications"
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                  notificationsEnabled && browserPermission !== 'denied' 
                    ? 'bg-amber-500' 
                    : 'bg-sky-950 border border-sky-800'
                }`}
              >
                <div className={`bg-sky-50 w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  notificationsEnabled && browserPermission !== 'denied' 
                    ? 'translate-x-5' 
                    : 'translate-x-0'
                }`} />
              </button>
            </div>
            
            {/* Account Settings Collapsible Menu Header */}
            <div className="flex items-center justify-between p-4 hover:bg-sky-900/40 cursor-pointer transition-colors group" onClick={() => setShowSettings(!showSettings)}>
              <div className="flex items-center gap-3">
                <FaCog className={`${showSettings ? 'text-amber-400' : 'text-sky-400/80'} group-hover:text-sky-300 transition-colors`} />
                <span className={`text-sm ${showSettings ? 'text-amber-400' : 'text-sky-100'} font-medium`}>Advanced Settings</span>
              </div>
              <FaChevronRight className={`${showSettings ? "text-amber-400 rotate-90" : "text-sky-500/50"} text-xs group-hover:text-sky-400 transition-all duration-300`} />
            </div>

            <div className={`transition-all duration-300 overflow-hidden ${showSettings ? 'max-h-40 border-t border-sky-800/20 bg-sky-950/40' : 'max-h-0'}`}>
              <div className="p-4 flex flex-col gap-4">
                
                {/* Streak Warning Switch */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FaExclamationTriangle className="text-sky-400/60 text-xs" />
                    <span className="text-xs text-sky-200">Streak Warnings</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => togglePreference('streakWarningEnabled', streakWarningEnabled)}
                    className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${streakWarningEnabled ? 'bg-amber-500' : 'bg-sky-950 border border-sky-800'}`}
                  >
                    <div className={`bg-sky-50 w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${streakWarningEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>

                {/* Daily Check-in Reminder Time Picker */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FaClock className="text-sky-400/60 text-xs" />
                    <span className="text-xs text-sky-200">Daily Reminder Time</span>
                  </div>
                  <input 
                    type="time" 
                    value={localTime}
                    onChange={handleTimeChange}
                    className="bg-sky-950 border border-sky-800 text-sky-100 text-xs font-mono rounded px-2 py-1 focus:outline-none focus:border-amber-400/60 transition-colors cursor-pointer scheme-dark"
                  />
                </div>

              </div>
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

      {/* PWA Permission Helper Modal */}
      {showPermissionHelp && (
        <div className="absolute inset-0 z-50 bg-sky-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-sky-900 border border-sky-700/50 rounded-2xl p-6 w-full max-w-sm shadow-2xl shadow-black/50 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-4 border border-red-500/30">
              <FaBell className="text-xl" />
            </div>
            <h3 className="text-lg font-bold text-sky-50 mb-2">Notifications Blocked</h3>
            <p className="text-sm text-sky-200/80 mb-6 leading-relaxed">
              Your device has blocked notifications for Kintsugi. To receive daily reminders, you'll need to re-enable them in your system settings.
            </p>
            
            <div className="w-full bg-sky-950/50 rounded-xl p-4 text-left border border-sky-800/50 mb-6">
              <p className="text-xs text-sky-300 font-semibold mb-2 uppercase tracking-wider">How to fix:</p>
              <ol className="text-sm text-sky-100 space-y-2 list-decimal pl-4 marker:text-sky-500/70">
                <li>Open your device <strong>Settings</strong></li>
                <li>Go to <strong>Apps</strong> or <strong>Notifications</strong></li>
                <li>Find <strong>Kintsugi</strong> (or your browser)</li>
                <li>Toggle Notifications to <strong>Allow</strong></li>
              </ol>
            </div>

            <button 
              onClick={() => setShowPermissionHelp(false)}
              className="w-full h-12 bg-sky-800 hover:bg-sky-700 text-sky-50 font-medium rounded-xl transition-colors duration-200"
            >
              I understand
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProfilePage;