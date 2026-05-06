import { useState, type SubmitEvent } from "react";
import { FiPlus } from "react-icons/fi"
import { addHabit } from "../api/habits";
import { toast } from "react-toastify";

interface AddHabitProps {
  setShowForm: (value: React.SetStateAction<boolean>) => void;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}

const AddHabitForm = ({ setShowForm, setRefreshKey }: AddHabitProps) => {
  const [habitTitle, setHabitTitle] = useState("");
  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const message = await addHabit(habitTitle);
      toast(message);
    } catch(e) {
      console.log(e);
    } finally {
      setShowForm(false);
      setRefreshKey(p => p+1);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full h-20 grid grid-cols-12 items-center">
      <div className="col-span-10 px-8">
        <label htmlFor="title" className="font-semibold text-lg">Title</label>
        <input
          id="title"
          type="text"
          value={habitTitle}
          onChange={(e) => setHabitTitle(e.target.value)}
          className="bg-sky-50 p-1 mx-2 text-zinc-900 rounded-md border-amber-600 focus:border-2 focus:outline-none"
        />
      </div>
      <button className="col-span-2 ml-1 bg-lime-600 h-8 w-8 flex items-center justify-center p-1 rounded-lg">
        <FiPlus className="h-full w-full" />
      </button>
    </form>
  )
}

export default AddHabitForm