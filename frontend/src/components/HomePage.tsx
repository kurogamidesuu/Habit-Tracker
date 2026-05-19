import HabitTab from "./HabitTab";
import { useResetStreak } from "../hooks/streakResetTimer";
import { useQueryClient } from "@tanstack/react-query";
import { HABITS_KEY, useHabits } from "../hooks/useHabits";
import { useUser } from "../hooks/useUser";

const HomePage = () => {
  const queryClient = useQueryClient();
  const { username } = useUser();
  const { habits, isLoading } = useHabits();

  useResetStreak(() => {
    queryClient.invalidateQueries({ queryKey: HABITS_KEY })
  });

  const completedHabitsCount = habits.filter(h => h.isComplete).length;
  const totalHabitsCount = habits.length;

  return (
    <main className="h-screen w-full md:w-1/2 md:mx-auto bg-sky-950 text-yellow-50 flex flex-col items-center py-3 px-4">
      <h1 className="text-[3.5em] font-bold text-transparent bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 bg-clip-text">KINTSUGI</h1>
      <h3>Welcome back, {username || 'User 67'}! Let's stay consistent.</h3>

      <div className="w-[95%] h-15 bg-sky-800 my-5 rounded-md flex flex-col items-center justify-center">
        <div className="bg-sky-100 w-[90%] h-1.5 flex">
          {habits.map((habit, index) => {
            if (habit.isComplete) {
              return (
                <div
                  key={`${index}-${habit.id}`}
                  style={{ width: `${100 / totalHabitsCount}%` }}
                  className={`h-full bg-green-600`}
                />
              );
            }
            return null;
          })}
        </div>
        <p className="text-sm mt-2">{completedHabitsCount}/{totalHabitsCount} Completed</p>
      </div>

      <div className="w-full my-5">
        <h3 className="text-xl">Habits remaining today:</h3>
        <div className="flex flex-col gap-2 my-2">
          {isLoading ?
           <p className="w-full h-40 flex items-center justify-center text-sky-200/50">Loading your Habits...</p>
          :
            habits.filter((habit) => !habit.isComplete).map((habit, index) => (
              <HabitTab
                key={`${index}-${habit.id}`}
                habit={habit}
              />
            ))
          }
        </div>
      </div>
    </main>
  )
}

export default HomePage