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
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AddHabitFormSchema>();
  const { addNewHabit } = useHabits();

  const onSubmit = async (formData: AddHabitFormSchema) => {
    const { title } = formData;
    
    try {
      await addNewHabit.mutateAsync(title);
      toast.success("Habit added successfully!");
      setShowForm(false);
    } catch(e) {
      console.log(e);
      toast.error("Failed to add habit");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full h-20 grid grid-cols-12 items-center md:px-4">
      <div className="col-span-10 px-8 flex flex-col gap-1">
        <div className="flex items-center">
          <label htmlFor="title" className="font-semibold">Title</label>
          <input
            id="title"
            type="text"
            {...register("title", { required: 'Title cannot be empty' })}
            className="w-full max-w-110 bg-sky-50 p-1 mx-2 text-zinc-900 rounded-md border-amber-600 focus:border-2 focus:outline-none"
            maxLength={40}
          />
        </div>
        {errors.title && <p className="ml-12 text-red-500 text-xs">{errors.title.message}</p>}
      </div>
      <button className="col-span-2 ml-1 bg-lime-600 h-8 w-8 md:w-12 hover:bg-lime-700 hover:text-sky-50/50 cursor-pointer flex items-center justify-center p-1 rounded-lg duration-200" disabled={isSubmitting}>
        <FiPlus className="h-full w-full" />
      </button>
    </form>
  )
}

export default AddHabitForm