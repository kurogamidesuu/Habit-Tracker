import { useEffect, useState } from "react"
import HabitBox from "./HabitBox";
import { fetchHabits, type Habit } from "../api/habits";

const HabitsPage = () => {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
   const getAllHabits = async () => {
    try {
      const fetchedHabits = await fetchHabits();
      setHabits(fetchedHabits);
    } catch(e) {
      console.log(e);
    }
  }

    getAllHabits();
  }, []);

  return (
    <main className="h-screen w-full bg-zinc-800 flex flex-col items-center justify-center text-slate-200">
      <h1>All your Habits in one place</h1>

      <div className="w-full bg-zinc-700 flex flex-col gap-2 items-center p-4">
        {habits.length > 0 ?
          habits.map((habit: Habit, index) => (
            <HabitBox
              key={`${index}-${habit.id}`}
              title={habit.title}
              streak={habit.streak}
              isComplete={habit.isComplete}
            />
          )) : <div className="h-10 w-10 border-5 border-blue-500 border-t-blue-50 rounded-full animate-spin" />
        
        }
      </div>
    </main>
  )
}

export default HabitsPage