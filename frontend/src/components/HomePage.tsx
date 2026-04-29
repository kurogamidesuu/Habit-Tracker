import { useEffect, useState } from "react"
import { getUser, type User } from "../api/user";

const HomePage = () => {
  const [username, setUsername] = useState("User67");

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const user: User = await getUser();
        setUsername(user.username);
      } catch(e) {
        console.log(e);
      }
    }

    getUserDetails();
  }, []);

  return (
    <main className="h-screen w-full bg-zinc-800 text-slate-300 flex flex-col items-center justify-center">
      <h1 className="text-3xl">Welcome to Kintsugi {username}</h1>
    </main>
  )
}

export default HomePage