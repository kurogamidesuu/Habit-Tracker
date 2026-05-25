import { useState } from "react"
import HabitBox from "./HabitBox";
import AddHabitForm from "./AddHabitForm";
import { useHabits } from "../hooks/useHabits";
import { FiPlus, FiX } from "react-icons/fi";

const HabitsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const { habits, isLoading } = useHabits();

  return (
    <main className="h-screen w-full md:w-1/2 mx-auto bg-sky-950 flex flex-col items-center text-sky-50 pt-8 px-4 pb-[88px] overflow-hidden relative">
      <h1 className="text-xl font-semibold my-2 tracking-wide shrink-0">
        Habits & Analytics
      </h1>

      <button
        className={`w-full max-w-md h-12 rounded-xl my-4 font-medium cursor-pointer transition-all duration-300 shrink-0 border flex items-center justify-center gap-2 shadow-sm ${
          showForm
            ? "bg-sky-900/40 border-amber-500/40 text-amber-400 hover:bg-sky-900/60"
            : "bg-sky-900/30 border-sky-800/60 text-sky-300 hover:bg-sky-800/40 hover:text-sky-100 hover:border-sky-600/50"
        }`}
        onClick={() => setShowForm(p => !p)}
      >
        {showForm ? (
          <>
            <FiX className="text-lg" />
            <span>Cancel</span>
          </>
        ) : (
          <>
            <FiPlus className="text-lg" />
            <span>Add New Habit</span>
          </>
        )}
      </button>

      {/* Form Container */}
      {showForm && (
        <div className="w-full max-w-md shrink-0">
          <AddHabitForm setShowForm={setShowForm} />
        </div>
      )}

      <div className="flex-1 w-full max-w-md flex flex-col gap-3 overflow-y-auto pr-1 pb-4">
        {isLoading ? (
          <p className="text-center text-sky-300/60 text-sm font-mono mt-8">
            Loading habits profile...
          </p>
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
          <div className="text-center text-sky-300/50 text-sm border-2 border-dashed border-sky-800/40 rounded-xl p-8 mt-4 shrink-0 flex flex-col items-center justify-center gap-2">
            <span>No habits tracked yet.</span>
            <span className="text-xs text-sky-400/60">Tap "Add New Habit" above to start building!</span>
          </div>
        )}
      </div>
    </main>
  )
}

export default HabitsPage