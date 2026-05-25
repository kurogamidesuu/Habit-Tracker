import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaFireFlameCurved } from "react-icons/fa6";
import { type Habit } from "../api/habits";
import { useHabits } from "../hooks/useHabits";

interface HabitProps {
  habit: Habit;
}

const HabitTab = ({ habit }: HabitProps) => {
  const { markHabitComplete } = useHabits();
  const [isPending, setIsPending] = useState(false);

  const handleCompleteHabit = async () => {
    if (isPending) return;
    try {
      setIsPending(true);
      const dateString = new Date().toLocaleDateString('en-CA');
      await markHabitComplete.mutateAsync({ id: habit.id, dateString });
    } catch(e) {
      console.log(e);
      setIsPending(false);
    }
  }

  return (
    <div className="w-full h-18 bg-sky-900/20 border border-amber-500/40 rounded-xl flex items-center justify-between px-4 py-2 shadow-md shadow-sky-950/20 hover:bg-sky-900/30 transition-all duration-200 group">
      
      {/* Habit Details Block */}
      <div className="flex flex-col min-w-0 pr-2 pointer-events-none">
        <h3 className="text-[0.95em] font-medium text-sky-100 truncate tracking-wide">
          {habit.title}
        </h3>
        <p className="text-[11px] text-sky-300/60 font-sans mt-0.5 flex items-center gap-1">
          Streak: <span className="font-bold text-amber-400" style={{ color: (habit.currentStreak > 0 ? '' : '#86929a') }}>{habit.currentStreak}d</span>
          {habit.currentStreak > 0 ? <FaFireFlameCurved className="text-amber-400" /> : <></>}
        </p>
      </div>

      {/* Interactive Complete Action Trigger */}
      <button
        onClick={handleCompleteHabit}
        disabled={isPending}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all duration-300 shrink-0 ${
          isPending
            ? "bg-sky-900/40 border-sky-800/50 text-sky-500 pointer-events-none animate-pulse"
            : "bg-sky-950/40 border-sky-800 text-sky-300 hover:text-lime-400 hover:border-lime-500/30 hover:bg-lime-950/20 shadow-sm"
        }`}
      >
        <span className="font-medium tracking-wide">
          {isPending ? "Saving..." : "Done"}
        </span>
        <FaCheckCircle 
          className={`h-5 w-5 transition-all duration-300 ${
            isPending 
              ? "text-sky-600" 
              : "text-sky-400/80 group-hover:text-lime-500 group-hover:scale-110"
          }`} 
        />
      </button>

    </div>
  )
}

export default HabitTab;