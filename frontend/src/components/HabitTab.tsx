import { FaCheckCircle } from "react-icons/fa";

interface HabitTabProps {
  title: string;
  streak: number;
}

const HabitTab = ({ title, streak }: HabitTabProps) => {
  return (
    <div className="h-18 w-full bg-gradient-to-br from-sky-300/50 to-sky-500/50 rounded-lg flex items-center px-2 py-1">
      <div className="w-[77%]">
        <h1 className="text-lg">{title}</h1>
        <p className="text-sm text-amber-300">current streak: <span className="text-base font-bold">{streak}</span></p>
      </div>
      <button className="w-[23%] flex items-center gap-2">
        <span className="text-sm">Done</span>
       <span>
         <FaCheckCircle className="h-8 w-8" />
       </span>
      </button>
    </div>
  )
}

export default HabitTab