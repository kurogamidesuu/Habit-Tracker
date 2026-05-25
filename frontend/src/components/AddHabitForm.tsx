import { FiPlus } from "react-icons/fi"
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useHabits } from "../hooks/useHabits";

interface AddHabitProps {
  setShowForm: (value: React.SetStateAction<boolean>) => void;
}

interface AddHabitFormSchema {
  title: string;
}

const AddHabitForm = ({ setShowForm }: AddHabitProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<AddHabitFormSchema>();
  const { addNewHabit } = useHabits();

  const onSubmit = async (formData: AddHabitFormSchema) => {
    try {
      await addNewHabit.mutateAsync(formData.title);
      toast.success("Habit added successfully!");
      reset();
      setShowForm(false);
    } catch(e) {
      console.log(e);
      toast.error("Failed to add habit");
    }
  }

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="w-full bg-sky-900/30 border border-sky-800/40 rounded-xl p-3 shadow-md mb-4 flex items-start gap-3 transition-all"
    >
      <div className="flex-1 flex flex-col gap-1">
        <input
          id="title"
          type="text"
          placeholder="What do you want to build?"
          {...register("title", { required: 'Please enter a habit title' })}
          className="w-full bg-sky-950/50 text-sky-50 text-sm px-4 py-2.5 rounded-lg border border-sky-800/60 focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 focus:outline-none placeholder-sky-400/40 transition-all"
          maxLength={40}
        />
        {errors.title && (
          <p className="text-red-400/90 text-[10px] pl-1 font-medium">{errors.title.message}</p>
        )}
      </div>

      <button 
        type="submit"
        disabled={isSubmitting}
        className={`h-10 w-12 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-200 ${
          isSubmitting 
            ? "bg-sky-900/40 border-sky-800 text-sky-600 cursor-not-allowed" 
            : "bg-lime-500/20 border-lime-500/40 text-lime-400 hover:bg-lime-500/30 hover:text-lime-300 shadow-sm cursor-pointer"
        }`}
      >
        <FiPlus className={`text-xl ${isSubmitting ? "animate-spin" : ""}`} />
      </button>
    </form>
  )
}

export default AddHabitForm