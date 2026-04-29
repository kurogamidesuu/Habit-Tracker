interface HabitProps {
  title: string;
  streak: number;
  isComplete: boolean;
}

const HabitBox = ({ title, streak, isComplete }: HabitProps) => {
  return (
    <div className="w-[90%] h-16 bg-sky-800/80 rounded-lg px-4 py-2 grid grid-cols-3 items-center">
      <h3>{title}</h3>
      <p>{streak}</p>
      {isComplete ? (
        <div className="h-5 w-5 bg-green-700 rounded-full" />
      ) : (
        <div className="h-5 w-5 bg-red-700 rounded-full" />
      )}
    </div>
  )
}

export default HabitBox