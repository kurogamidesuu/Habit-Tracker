import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { signup } from "../api/auth";

interface SignupFormSchema {
  username: string;
  email: string;
  password: string;
}

const SignupPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupFormSchema>();
  const { setAccessToken } = useAuth();
  

  const onSubmit = async (formData: SignupFormSchema) => {
    const { username, email, password } = formData;

    try {
      const data = await signup(username, email, password);

      if (data.success) {
        setAccessToken(data.token);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch(e) {
      if (e instanceof Error) {
        console.error('Error in signup', e);
      }
      toast.error('Something went wrong!');
    }
  }

  return (
    <main className="min-h-screen w-full bg-black font-sans selection:bg-amber-500/30 flex justify-center">
      <div className="w-full md:w-1/2 max-w-md bg-sky-950 flex flex-col items-center relative overflow-hidden">
        
        <div className="absolute top-[5%] -right-[20%] w-72 h-72 bg-amber-500/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-[60%] -left-[30%] w-80 h-80 bg-sky-400/10 rounded-full blur-[70px] pointer-events-none" />
        <div className="absolute -bottom-[5%] right-[5%] w-96 h-96 bg-amber-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full h-full flex flex-col px-8 py-10 overflow-y-auto">
          
          <div className="mt-4 mb-8 flex flex-col items-center shrink-0">
            <h1 className="text-[3em] font-extrabold text-transparent bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 bg-clip-text leading-none tracking-tight drop-shadow-sm">
              KINTSUGI
            </h1>
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent mt-3 mb-2" />
            <p className="text-sky-300/80 text-[11px] font-medium tracking-[0.15em] uppercase">
              Start your journey
            </p>
          </div>

          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="w-full bg-sky-900/20 backdrop-blur-md border border-sky-800/40 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 shrink-0"
          >
            {/* Username Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-[10px] font-semibold tracking-wider text-sky-400 uppercase pl-1">Username</label>
              <div className="relative flex items-center">
                <FiUser className="absolute left-4 text-sky-400/60 text-lg" />
                <input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  {...register("username", { required: 'Please enter a valid username' })}
                  className="w-full bg-sky-950/50 border border-sky-800/60 rounded-xl pl-11 pr-4 py-3 text-sm text-sky-50 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder-sky-400/30 shadow-inner"
                />
              </div>
              {errors.username && <p className="text-red-400/90 text-[10px] pl-1">{errors.username.message}</p>}
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[10px] font-semibold tracking-wider text-sky-400 uppercase pl-1">Email</label>
              <div className="relative flex items-center">
                <FiMail className="absolute left-4 text-sky-400/60 text-lg" />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", { required: 'Email is required' })}
                  className="w-full bg-sky-950/50 border border-sky-800/60 rounded-xl pl-11 pr-4 py-3 text-sm text-sky-50 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder-sky-400/30 shadow-inner"
                />
              </div>
              {errors.email && <p className="text-red-400/90 text-[10px] pl-1">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-[10px] font-semibold tracking-wider text-sky-400 uppercase pl-1">Password</label>
              <div className="relative flex items-center">
                <FiLock className="absolute left-4 text-sky-400/60 text-lg" />
                <input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  {...register("password", { required: 'Please enter a password' })}
                  className="w-full bg-sky-950/50 border border-sky-800/60 rounded-xl pl-11 pr-4 py-3 text-sm text-sky-50 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder-sky-400/30 shadow-inner"
                />
              </div>
              {errors.password && <p className="text-red-400/90 text-[10px] pl-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full h-12 mt-3 rounded-xl font-bold tracking-wide transition-all duration-300 shadow-lg relative overflow-hidden group ${
                isSubmitting
                  ? "bg-amber-900/50 text-amber-500/50 cursor-not-allowed border border-amber-900/30"
                  : "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-sky-950 hover:shadow-amber-500/25 border border-amber-300"
              }`}
            >
              <span className="relative z-10">{isSubmitting ? "Creating Account..." : "Sign Up"}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-sky-300/60 shrink-0 pb-6">
            <span>Already have an account? </span>
            <Link to='/login' className="text-amber-400 font-semibold hover:text-amber-300 transition-colors drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">
              Log in
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}

export default SignupPage