import { FiPlus } from "react-icons/fi"
import { toast } from "react-toastify";
import { useHabitStore } from "../store/useHabitStore";
import { useForm } from "react-hook-form";

interface AddHabitProps {
  setShowForm: (value: React.SetStateAction<boolean>) => void;
}

interface AddHabitFormSchema {
  title: string;
}

const AddHabitForm = ({ setShowForm }: AddHabitProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AddHabitFormSchema>();
  const { addNewHabit } = useHabitStore();

  const onSubmit = async (formData: AddHabitFormSchema) => {
    const { title } = formData;
    
    try {
      await addNewHabit(title);
      toast.success("Habit added successfully!");
      setShowForm(false);
    } catch(e) {
      console.log(e);
      toast.error("Failed to add habit");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full h-20 grid grid-cols-12 items-center">
      <div className="col-span-10 px-8">
        <label htmlFor="title" className="font-semibold text-lg">Title</label>
        <input
          id="title"
          type="text"
          {...register("title", { required: 'Title cannot be empty' })}
          className="bg-sky-50 p-1 mx-2 text-zinc-900 rounded-md border-amber-600 focus:border-2 focus:outline-none"
          maxLength={40}
        />
        {errors.title && <p className="ml-12 mt-1 text-red-500">{errors.title.message}</p>}
      </div>
      <button className="col-span-2 ml-1 bg-lime-600 h-8 w-8 flex items-center justify-center p-1 rounded-lg" disabled={isSubmitting}>
        <FiPlus className="h-full w-full" />
      </button>
    </form>
  )
}

export default AddHabitForm