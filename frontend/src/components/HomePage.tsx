import { Preferences } from "@capacitor/preferences";
import { useEffect, useState } from "react"

const HomePage = () => {
  const [username, setUsername] = useState("User67");

  useEffect(() => {
    const getUser = async () => {
      const { value: token } = await Preferences.get({ key: 'habit-token' });
      const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      if (data.success) {
        setUsername(data.user.username);
      } else {
        console.log('Failed to load profile')
      }
    }

    getUser();
  }, [])

  return (
    <main className="h-screen w-full bg-zinc-800 text-slate-300 flex flex-col items-center justify-center">
      <h1 className="text-3xl">Welcome to Kintsugi {username}</h1>
    </main>
  )
}

export default HomePage