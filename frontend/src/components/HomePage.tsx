import HabitTab from "./HabitTab";
import { useHabits } from "../hooks/useHabits";
import { useUser } from "../hooks/useUser";
import { useNotifications } from "../hooks/useNotifications";

const HomePage = () => {
  useNotifications();
  
  const { username } = useUser();
  const { habits, isLoading } = useHabits();

  const totalHabitsCount = habits.length;
  const completedHabitsCount = habits.filter(h => h.isComplete).length;
  const habitsRemaining = habits.filter(h => !h.isComplete);
  
  const progressPercent = totalHabitsCount === 0 
    ? 0 
    : Math.round((completedHabitsCount / totalHabitsCount) * 100);

  return (
    <main className="h-screen w-full md:w-1/2 mx-auto bg-sky-950 text-sky-50 flex flex-col items-center pt-8 px-4 pb-[88px] overflow-hidden relative">
      
      {/* Header Section (Static) */}
      <h1 className="text-[3.5em] font-extrabold text-transparent bg-gradient-to-r from-amber-600 via-amber-400 to-amber-300 bg-clip-text shrink-0 leading-tight tracking-tight">
        KINTSUGI
      </h1>
      <h3 className="text-sm text-sky-200/80 mb-6 shrink-0 font-medium text-center">
        Welcome back, {username || 'User'}! Let's stay consistent.
      </h3>

      {/* Progress Dashboard Card (Static) */}
      <div className="w-full max-w-md bg-sky-900/40 border border-sky-800/50 rounded-xl p-5 mb-6 shrink-0 shadow-lg shadow-sky-950/40">
        <div className="flex justify-between items-end mb-2.5">
          <span className="text-[11px] text-sky-300 font-semibold uppercase tracking-widest">
            Today's Progress
          </span>
          <span className="text-sm font-bold text-sky-100">
            {completedHabitsCount} <span className="text-sky-400/60 font-medium text-xs">/ {totalHabitsCount}</span>
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-sky-950 h-3 rounded-full overflow-hidden border border-sky-800/30 shadow-inner">
          <div
            className="bg-gradient-to-r from-sky-400 via-teal-400 to-lime-500 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        
        {progressPercent === 100 && totalHabitsCount > 0 && (
          <p className="text-center text-xs text-amber-400 mt-3 font-medium animate-pulse">
            All tasks completed for today. Great job!
          </p>
        )}
      </div>

      {/* Scrollable Habits Feed */}
      <div className="w-full max-w-md flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between mb-3 shrink-0">
          <h3 className="text-[11px] text-sky-400 uppercase tracking-widest font-semibold">
            Pieces left to Polish
          </h3>
          <span className="text-[10px] text-amber-400/70 font-mono bg-sky-900/30 px-2 py-0.5 rounded border border-sky-800/30">
            {habitsRemaining.length} Pending
          </span>
        </div>

        {/* Localized Scroll Window */}
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1 pb-4">
          {isLoading ? (
            <div className="text-center text-sky-300/60 text-sm font-mono mt-8">
              Loading your schedule...
            </div>
          ) : habitsRemaining.length > 0 ? (
            habitsRemaining.map((habit, index) => (
              <HabitTab
                key={`${index}-${habit.id}`}
                habit={habit}
              />
            ))
          ) : totalHabitsCount === 0 ? (
             <div className="text-center text-sky-300/50 text-sm border-2 border-dashed border-sky-800/40 rounded-xl p-8 mt-4 shrink-0 flex flex-col items-center justify-center gap-2">
               <span>No habits tracked yet.</span>
               <span className="text-xs text-sky-400/60">Head to the Habits tab to start building!</span>
             </div>
          ) : (
             <div className="text-center text-lime-400/60 text-sm border border-lime-900/30 bg-lime-950/20 rounded-xl p-8 mt-4 shrink-0">
               You are all caught up for today. Rest and recover!
             </div>
          )}
        </div>
      </div>

    </main>
  )
}

export default HomePage