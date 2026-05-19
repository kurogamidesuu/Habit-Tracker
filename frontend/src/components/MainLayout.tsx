import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

const MainLayout = () => {
  return (
    <div className="bg-gradient-to-br from-sky-950 via-sky-900 to-sky-950">
      <Outlet />
      <Navbar />
    </div>
  )
}

export default MainLayout