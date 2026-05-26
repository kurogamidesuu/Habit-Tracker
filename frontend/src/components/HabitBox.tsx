import { useState, useRef } from "react";
import { FaTrash, FaChartBar, FaChevronDown } from "react-icons/fa";
import { toast } from "react-toastify";
import { useHabits } from "../hooks/useHabits";
import { FaFireFlameCurved } from "react-icons/fa6";
import AnalyticsPanel from "./AnalyticsPanel";

interface HabitProps {
  id: string;
  title: string;
  currentStreak: number;
  maxStreak: number;
  isComplete: boolean;
}

const HabitBox = ({ id, title, currentStreak, maxStreak, isComplete }: HabitProps) => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const { removeHabit } = useHabits();

  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    modalRef.current?.showModal();
  };

  const closeModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    modalRef.current?.close();
  };

  const handleDelete = async () => {
    try {
      await removeHabit.mutateAsync(id);
      toast.success("Habit deleted");
    } catch (e) {
      console.log(e);
      toast.error("Failed to delete habit");
    } finally {
      modalRef.current?.close();
    }
  };

  return (
    <div className="w-full flex flex-col shadow-md shadow-sky-950/40 rounded-xl group">
      <div
        onClick={() => setShowAnalytics((p) => !p)}
        className={`w-full h-18 bg-sky-900/40 px-4 py-2 flex justify-between items-center border-l-[6px] transition-all duration-200 select-none ${
          showAnalytics 
            ? "bg-sky-900/60 border-amber-500 rounded-t-xl" 
            : isComplete
              ? "border-lime-500 hover:bg-sky-900/50 rounded-xl"
              : "border-transparent hover:bg-sky-900/50 rounded-xl"
        }`}
      >
        <div className="flex items-center gap-3 w-[52%]">
          <FaChevronDown className={`text-xs text-sky-400/80 shrink-0 transition-transform duration-300 ${showAnalytics ? "rotate-180 text-amber-400" : ""}`} />
          <h3 className="text-[0.95em] font-medium truncate tracking-wide text-sky-100">{title}</h3>
        </div>

        <div className="text-[0.78em] text-sky-200/70 font-sans leading-tight shrink-0">
          <p className="flex gap-1">Current:
            <span className="font-semibold text-sky-50">
              {currentStreak}d
            </span>
            {currentStreak > 0 && <FaFireFlameCurved className="text-amber-400" />}
          </p>
          <p>Max: <span className="font-semibold text-sky-50">{maxStreak}d</span></p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAnalytics((p) => !p);
            }}
            className={`text-lg p-1 rounded transition-colors ${showAnalytics ? "text-amber-400" : "text-sky-400 hover:text-amber-400"}`}
          >
            <FaChartBar />
          </button>
          <button
            onClick={openModal}
            className="text-md p-1 rounded text-sky-400 hover:text-red-400 transition-colors"
          >
            <FaTrash />
          </button>
        </div>

        <dialog
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          className="h-40 w-[85%] max-w-sm left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 p-4 bg-sky-900 border border-sky-700 shadow-2xl rounded-2xl text-sky-50 backdrop:bg-black/60"
        >
          <h2 className="text-md font-medium text-center mt-2">Are you sure you want to delete this habit?</h2>
          <div className="absolute bottom-5 left-0 px-6 flex justify-between w-full gap-3">
            <button
              className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 flex-1 h-9 rounded-xl text-red-200 font-medium cursor-pointer transition-colors"
              onClick={handleDelete}
            >
              Yes, Delete
            </button>
            <button
              className="bg-sky-950 hover:bg-sky-800 border border-sky-700 flex-1 h-9 rounded-xl text-sky-200 font-medium cursor-pointer transition-colors"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </dialog>
      </div>

      <div
        className={`transition-all duration-300 overflow-hidden ${
          showAnalytics ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {showAnalytics && <AnalyticsPanel habitId={id} />}
      </div>
    </div>
  );
};

export default HabitBox;