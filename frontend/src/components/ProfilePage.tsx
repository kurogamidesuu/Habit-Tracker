import { useEffect, useState } from "react";
import { getUser, type User } from "../api/user";
import { fetchHabits, type Habit } from "../api/habits";

const ProfilePage = () => {
  const [username, setUsername] = useState("User67");
  const [habitsCount, setHabitsCount] = useState(0);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const user: User = await getUser();
        setUsername(user.username);
      } catch(e) {
        console.log(e);
      }
    }

    const getHabitDetails = async () => {
      try {
        const habits: Habit[] = await fetchHabits();
        setHabitsCount(habits.length);
      } catch(e) {
        console.log(e);
      }
    }

    getUserDetails();
    getHabitDetails();
  }, []);

  return (
    <main className="h-screen w-full bg-sky-950 text-slate-200 flex flex-col items-center py-10 px-2">
      <h1 className="text-3xl font-bold">Your Profile</h1>
      <h2 className="text-xl text-amber-400 font-semibold">{username}</h2>
      <p>Total habits: {habitsCount}</p>
    </main>
  )
}

export default ProfilePage