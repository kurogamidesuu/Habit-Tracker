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
    <main className="h-screen w-full bg-sky-950 flex flex-col items-center text-sky-50 py-4">
      <h1 className="text-xl my-2">All your Habits in one place</h1>

      <button
        className="w-[80%] h-10 bg-lime-600 rounded-md my-5"
      >
        Add new habit
      </button>

      <div className="w-full bg-sky-600/20 flex flex-col gap-2 items-center p-4">
        {habits.length > 0 ?
          habits.map((habit, index) => (
            <HabitBox
              id={habit.id}
              key={`${index}-${habit.id}`}
              title={habit.title}
              streak={habit.streak}
              isComplete={habit.isComplete}
            />
          )) : <div>No habits yet...</div>
        
        }
      </div>
    </main>
  )
}

export default HabitsPage