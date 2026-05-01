import { FaCheckCircle } from "react-icons/fa";
import { completeHabit, type Habit } from "../api/habits";

interface HabitProps {
  habit: Habit;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}

const HabitTab = ({ habit, setRefreshKey }: HabitProps) => {
  const handleCompleteHabit = async () => {
    try {
      await completeHabit(habit.id);
      setRefreshKey(p => p+1);
    } catch(e) {
      console.log(e);
    }
  }

  return (
    <div className="h-18 w-full bg-gradient-to-br from-sky-300/50 to-sky-500/50 rounded-lg flex items-center px-2 py-1">
      <div className="w-[77%]">
        <h1 className="text-lg">{habit.title}</h1>
        <p className="text-sm text-amber-300">current streak: <span className="text-base font-bold">{habit.streak}</span></p>
      </div>
      <button
        onClick={handleCompleteHabit}
        className="w-[23%] flex items-center gap-2"
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