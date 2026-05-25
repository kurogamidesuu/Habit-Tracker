import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

const MainLayout = () => {
  return (
    <div className="w-full min-h-screen bg-black text-sky-50 font-sans selection:bg-amber-500/30">
      <Outlet />
      <Navbar />
    </div>
  )
}

export default MainLayout