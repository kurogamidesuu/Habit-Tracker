import { FaCheckCircle } from "react-icons/fa";
import { type Habit } from "../api/habits";
import { useHabits } from "../hooks/useHabits";

interface HabitProps {
  habit: Habit;
}

const HabitTab = ({ habit }: HabitProps) => {
  const { markHabitComplete } = useHabits();

  const handleCompleteHabit = async () => {
    try {
      const dateString = new Date().toLocaleDateString('en-CA');
      await markHabitComplete.mutateAsync({ id: habit.id, dateString });
    } catch(e) {
      console.log(e);
    }
  }

  return (
    <div className="h-18 w-full bg-gradient-to-br from-sky-300/50 to-sky-500/50 rounded-lg flex items-center justify-between px-2 md:px-4 py-1">
      <div className="pointer-events-none">
        <h1 className="text-[0.9em]">{habit.title}</h1>
        <p className="text-sm text-amber-300/90 my-1">current streak: <span className="text-[1em] text-amber-300 font-bold">{habit.currentStreak}</span></p>
      </div>
      <button
        onClick={handleCompleteHabit}
        className="flex items-center gap-2 hover:text-lime-500 cursor-pointer duration-200"
      >
        <span className="text-sm">Done</span>
       <span>
         <FaCheckCircle className="h-8 w-8" />
       </span>
      </button>
    </div>
  )
}

export default HabitTab