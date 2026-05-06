import { useEffect, useState } from "react"
import { getUser, type User } from "../api/user";
import { fetchHabits, type Habit, } from "../api/habits";
import HabitTab from "./HabitTab";
import { useResetStreak } from "../hooks/streakResetTimer";

const HomePage = () => {
  const [username, setUsername] = useState("");
  const [habits, setHabits] = useState<Habit[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useResetStreak(() => {
    console.log('Midnight hit resetting UI...');

    setHabits(prevHabits => prevHabits.map(habit => ({
      ...habit,
      isComplete: false,
    })));
  });

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const user: User = await getUser();
        setUsername(user.username);
      } catch(e) {
        console.log(e);
      }
    }

    getUserDetails();
  }, [])

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
  }, [refreshKey]);

  return (
    <main className="h-screen w-full bg-sky-950 text-yellow-50 flex flex-col items-center py-3 px-4">
      <h1 className="text-[3.5em] font-bold text-transparent bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 bg-clip-text">KINTSUGI</h1>
      <h3>Welcome back, {username}! Let's stay consistent.</h3>

      <div className="w-[95%] h-15 bg-sky-800 my-5 rounded-md flex flex-col items-center justify-center">
        <div className="bg-sky-100 w-[90%] h-1.5 flex">
          {habits.map((habit, index) => {
            if (habit.isComplete) return <div key={`${index}-${habit.id}`} className={`h-full w-1/${(habits.length)} bg-green-600`} />
          })}
        </div>
        <p className="text-sm mt-2">{habits.filter(h => h.isComplete).length}/{habits.length} Completed</p>
      </div>

      <div className="w-full my-5">
        <h3 className="text-xl">Habits remaining today:</h3>
        <div className="flex flex-col gap-2 my-2">
          {habits.filter((habit) => !habit.isComplete).map((habit, index) => (
            <HabitTab
              key={`${index}-${habit.id}`}
              habit={habit}
              setRefreshKey={setRefreshKey}
            />
          ))}
        </div>
      </div>
    </main>
  )
}

export default HomePage