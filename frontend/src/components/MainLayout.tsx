import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

const MainLayout = () => {
  return (
    <div>
      <Outlet />
      <Navbar />
    </div>
  )
}

export default MainLayout