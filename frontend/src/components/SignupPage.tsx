import { Preferences } from "@capacitor/preferences";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface SignupFormSchema {
  username: string;
  email: string;
  password: string;
}

const SignupPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormSchema>();

  const onSubmit = async (formData: SignupFormSchema) => {
    const { username, email, password } = formData;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (data.success) {
        await Preferences.set({
          key: 'habit-token',
          value: data.token,
        });
        navigate('/');
      } else {
        console.error(data.message);
        toast.error(data.message);
      }
    } catch(e) {
      console.error('Something went wrong!', e);
      toast.error('Something went wrong!');
    }
  }

  return (
    <main className="h-screen w-full bg-sky-200/70 flex flex-col items-center">
      <div className="w-fit h-[33%] flex flex-col items-center justify-end pb-4">
        <p className="w-[90%] text-lg text-rose-900 font-semibold">Welcome to</p>
        <h1 className="text-[4em] font-bold italic -mt-5 text-transparent bg-gradient-to-r from-rose-700 to-purple-600 bg-clip-text">Kintsugi</h1>
      </div>
      <div className="w-full h-[67%] bg-gradient-to-br from-sky-600 via-sky-600 to-cyan-600 rounded-t-[20px]">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full h-[80%] px-5 flex flex-col items-center justify-center gap-10">
          <div className="grid grid-cols-10 items-center gap-5">
            {/* username */}
            <label htmlFor="username" className="text-lg font-semibold text-sky-100 col-span-3">Username:</label>
            <input
              id="username"
              type="text"
              {...register("username", { required: 'Please enter a valid username' })}
              className="h-10 bg-slate-200 rounded-sm col-span-7 px-2"
            />
            {errors.username && (
              <>
                <div className="col-span-3" />
                <p className="col-span-7 -mt-3 text-red-600 font-bold">{errors.username.message}</p>
              </>
            )}

            {/* email */}
            <label htmlFor="email" className="text-lg font-semibold text-sky-100 col-span-3">Email:</label>
            <input
              id="email"
              type="email"
              {...register("email", { required: 'Email is required' })}
              className="h-10 bg-slate-200 rounded-sm col-span-7 px-2"
            />
            {errors.email && (
              <>
                <div className="col-span-3" />
                <p className="col-span-7 -mt-3 text-red-600 font-bold">{errors.email.message}</p>
              </>
            )}

            {/* password */}
            <label htmlFor="password" className="text-lg font-semibold text-sky-100 col-span-3">Password:</label>
            <input
              id="password"
              type="password"
              {...register("password", { required: 'Please enter a password' })}
              className="h-10 bg-slate-200 rounded-sm col-span-7 px-2"
            />
            {errors.password && (
              <>
                <div className="col-span-3" />
                <p className="col-span-7 -mt-3 text-red-600 font-bold">{errors.password.message}</p>
              </>
            )}
          </div>

          <div className="flex flex-col gap-5 items-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-50 h-10 bg-gradient-to-br from-amber-400 via-amber-300 to-amber-500 rounded-[10px]">
              Signup
            </button>
            <div className="flex gap-2">
              <p>Already have an account?</p>
              <Link to='/login' className="text-amber-400 font-semibold">Login</Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}

export default SignupPage