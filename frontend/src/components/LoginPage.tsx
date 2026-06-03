import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";

interface LoginFormSchema {
  email: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { handleSubmit, register, formState: { errors, isSubmitting } } = useForm<LoginFormSchema>();
  const { setAccessToken } = useAuth();

  const onSubmit = async (formData: LoginFormSchema) => {
    const { email, password } = formData;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setAccessToken(data.token);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch(e) {
      if (e instanceof Error) {
        console.error('Error in login:', e);
      }
      toast.error('Something went wrong!');
    }
  }

  return (
    <main className="min-h-screen w-full bg-black font-sans selection:bg-amber-500/30 flex justify-center">
      <div className="w-full md:w-1/2 max-w-md bg-sky-950 flex flex-col items-center relative overflow-hidden">
        
        <div className="absolute -top-[15%] -left-[20%] w-80 h-80 bg-amber-600/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-[40%] -right-[30%] w-72 h-72 bg-sky-500/10 rounded-full blur-[70px] pointer-events-none" />
        <div className="absolute -bottom-[10%] left-[10%] w-96 h-96 bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Foreground Content */}
        <div className="relative z-10 w-full h-full flex flex-col px-8 py-16 overflow-y-auto">
          
          <div className="mt-8 mb-12 flex flex-col items-center shrink-0">
            <h1 className="text-[3.5em] font-extrabold text-transparent bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 bg-clip-text leading-none tracking-tight drop-shadow-sm">
              KINTSUGI
            </h1>
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mt-4 mb-3" />
            <p className="text-sky-300/80 text-xs font-medium tracking-[0.2em] uppercase text-center">
              Embrace the process.<br/>Build the habit.
            </p>
          </div>

          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="w-full bg-sky-900/20 backdrop-blur-md border border-sky-800/40 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 shrink-0"
          >
            {/* Email Input */}
            <div className="flex flex-col gap-1.5 relative">
              <label htmlFor="email" className="text-[10px] font-semibold tracking-wider text-sky-400 uppercase pl-1">Email</label>
              <div className="relative flex items-center">
                <FiMail className="absolute left-4 text-sky-400/60 text-lg" />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full bg-sky-950/50 border border-sky-800/60 rounded-xl pl-11 pr-4 py-3 text-sm text-sky-50 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder-sky-400/30 shadow-inner"
                />
              </div>
              {errors.email && <p className="text-red-400/90 text-[10px] pl-1">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5 relative">
              <label htmlFor="password" className="text-[10px] font-semibold tracking-wider text-sky-400 uppercase pl-1">Password</label>
              <div className="relative flex items-center">
                <FiLock className="absolute left-4 text-sky-400/60 text-lg" />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", { required: "Please enter a password" })}
                  className="w-full bg-sky-950/50 border border-sky-800/60 rounded-xl pl-11 pr-4 py-3 text-sm text-sky-50 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder-sky-400/30 shadow-inner"
                />
              </div>
              {errors.password && <p className="text-red-400/90 text-[10px] pl-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full h-12 mt-2 rounded-xl font-bold tracking-wide transition-all duration-300 shadow-lg relative overflow-hidden group ${
                isSubmitting
                  ? "bg-amber-900/50 text-amber-500/50 cursor-not-allowed border border-amber-900/30"
                  : "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-sky-950 hover:shadow-amber-500/25 border border-amber-300"
              }`}
            >
              <span className="relative z-10">{isSubmitting ? "Authenticating..." : "Sign In"}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-sky-300/60 shrink-0">
            <span>Don't have an account? </span>
            <Link to='/signup' className="text-amber-400 font-semibold hover:text-amber-300 transition-colors drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">
              Create one
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}

export default LoginPage