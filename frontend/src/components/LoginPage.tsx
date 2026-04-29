import { Preferences } from "@capacitor/preferences";
import { useState, type SubmitEvent } from "react";
import { Link, useNavigate, } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        await Preferences.set({
          key: 'habit-token',
          value: data.token,
        });
        navigate('/');
      } else {
        console.log(data.message);
      }
    } catch(e) {
      console.error('Something went wrong!', e);
    }
  }

  return (
    <main className="h-screen w-full bg-sky-200/70 flex flex-col items-center">
      <div className="w-fit h-[33%] flex flex-col items-center justify-end pb-4">
        <p className="w-[90%] text-lg text-rose-900 font-semibold">Welcome to</p>
        <h1 className="text-[4em] font-bold italic -mt-5 text-transparent bg-gradient-to-r from-rose-700 to-purple-600 bg-clip-text">Kintsugi</h1>
      </div>
      <div className="w-full h-[67%] bg-gradient-to-br from-sky-600 via-sky-600 to-cyan-600 rounded-t-[20px]">
        <form onSubmit={handleSubmit} className="w-full h-[80%] px-5 flex flex-col items-center justify-center gap-20">
          <div className="grid grid-cols-10 items-center gap-5">
            {/* email */}
            <label htmlFor="email" className="text-lg font-semibold text-sky-100 col-span-3">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 bg-slate-200 rounded-sm col-span-7 px-2"
              required
            />

            {/* password */}
            <label htmlFor="password" className="text-lg font-semibold text-sky-100 col-span-3">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 bg-slate-200 rounded-sm col-span-7 px-2"
              required
            />
          </div>


          <div className="flex flex-col gap-5 items-center">
            <button
              type="submit"
              className="w-50 h-10 bg-gradient-to-br from-amber-400 via-amber-300 to-amber-500 rounded-[10px]">
              Login
            </button>
            <div className="flex gap-2">
              <p>Don't have an account?</p>
              <Link to='/signup' className="text-amber-400 font-semibold">Signup</Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}

export default LoginPage