import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useRef } from "react";
import { useHabitStore } from "../store/useHabitStore";

interface HabitProps {
  id: string;
  title: string;
  currentStreak: number;
  maxStreak: number;
  isComplete: boolean;
}

const HabitBox = ({ id, title, currentStreak, maxStreak, isComplete }: HabitProps) => {
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const { removeHabit } = useHabitStore();

  const openModal = () => modalRef.current?.showModal();
  const closeModal = () => modalRef.current?.close();

  const handleDelete = async () => {
    try {
      await removeHabit(id);
      toast.success("Habit deleted");
    } catch(e) {
      console.log(e);
      toast.error("Failed to delete habit");
    } finally {
      closeModal();
    }
  }

  return (
    <div className={`w-full h-18 bg-sky-600/50 rounded-lg px-4 py-2 flex justify-between items-center border-l-5 ${isComplete ? 'border-lime-500' : "border-transparent"}`}>
      <h3 className="w-[50%] text-[0.9em]">{title}</h3>
      <div className="text-[0.8em] text-sky-100/80">
        <p>Current Streak: {currentStreak}</p>
        <p>Max Streak: {maxStreak}</p>
      </div>
      <div>
        <button
          onClick={openModal}
          className="text-xl hover:text-red-800"
        >
          <FaTrash />
        </button>
      </div>

      <dialog
        ref={modalRef}
        className="h-40 w-[80%] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 p-3 bg-sky-900 border-2 border-amber-500 rounded-xl text-sky-50"
      >
        <h2 className="text-lg">Are you sure you want to delete?</h2>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex justify-evenly w-full">
          <button
            className="bg-sky-300/80 w-20 h-7 rounded-md text-sky-900 font-bold"
            onClick={handleDelete}
          >
            Yes
          </button>
          <button
            className="bg-sky-300/80 w-20 h-7 rounded-md text-sky-900 font-bold"
            onClick={closeModal}
          >
            No
          </button>
        </div>
      </dialog>
    </div>
  )
}

export default HabitBox