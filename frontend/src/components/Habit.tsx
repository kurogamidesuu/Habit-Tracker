interface HabitProps {
  title: string;
  streak: number;
  isComplete: boolean;
}

const Habit = ({ title, streak, isComplete }: HabitProps) => {
  return (
    <div>
      <h3>{title}</h3>
      <p>{streak}</p>
      <p>{isComplete}</p>
    </div>
  )
}

export default Habit