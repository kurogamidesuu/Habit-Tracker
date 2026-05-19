import { useState } from "react"
import HabitBox from "./HabitBox";
import AddHabitForm from "./AddHabitForm";
import { useResetStreak } from "../hooks/streakResetTimer";
import { useQueryClient } from "@tanstack/react-query";
import { HABITS_KEY, useHabits } from "../hooks/useHabits";

const HabitsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();
  const { habits, isLoading } = useHabits();

  useResetStreak(() => {
    queryClient.invalidateQueries({ queryKey: HABITS_KEY });
  });

  return (
    <main className="h-screen w-full bg-sky-950 flex flex-col items-center text-sky-50 py-4">
      <h1 className="text-xl my-2">All your Habits in one place</h1>

      <button
        className="w-[80%] h-10 bg-lime-600 rounded-md my-5"
        onClick={() => setShowForm(p => !p)}
      >
        {showForm ? "Close" : "Add New Habit"}
      </button>

      {showForm && <AddHabitForm setShowForm={setShowForm} />}

      <div className="w-full bg-sky-600/20 flex flex-col gap-2 items-center p-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : habits.length > 0 ? (
          habits.map((habit, index) => (
            <HabitBox
              id={habit.id}
              key={`${index}-${habit.id}`}
              title={habit.title}
              currentStreak={habit.currentStreak}
              maxStreak={habit.maxStreak}
              isComplete={habit.isComplete}
            />
          ))
        ) : (
          <div>No habits yet...</div>
        )}
      </div>
    </main>
  )
}

export default HabitsPage