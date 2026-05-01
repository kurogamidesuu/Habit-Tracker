import { FaTrash } from "react-icons/fa";
import { deleteHabit } from "../api/habits";

interface HabitProps {
  id: number;
  title: string;
  streak: number;
  isComplete: boolean;
}

const HabitBox = ({ id, title, streak, isComplete }: HabitProps) => {
  const handleDelete = async () => {
    try {
      const data = await deleteHabit(id);
      alert(data.message);
      location.reload();
    } catch(e) {
      console.log(e);
    }
  }

  return (
    <div className={`w-full h-16 bg-sky-600/50 rounded-lg px-4 py-2 flex gap-2 justify-between items-center border-l-5 ${isComplete ? 'border-lime-500' : "border-transparent"}`}>
      <h3 className="w-[40%]">{title}</h3>
      <div className="text-sm">
        <p>Current Streak: {streak}</p>
        <p>Max Streak: {streak}</p>
      </div>
      <div>
        <button
          onClick={handleDelete}
          className="text-xl hover:text-red-800"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  )
}

export default HabitBox