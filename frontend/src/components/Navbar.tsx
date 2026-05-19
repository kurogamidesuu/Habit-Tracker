import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <nav className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-slate-300 text-zinc-900 w-full md:w-1/2 h-20 p-2 flex items-center justify-evenly">
      <Link to='/'>Home</Link>
      <Link to='/habits'>Habits</Link>
      <Link to='/profile'>Profile</Link>
    </nav>
  )
}

export default Navbar