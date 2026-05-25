import { NavLink } from "react-router-dom";
import { FaHome, FaListUl, FaUser } from "react-icons/fa";

const Navbar = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center gap-1 w-16 h-full transition-all duration-300 ${
      isActive 
        ? "text-amber-400 scale-105"
        : "text-sky-400/50 hover:text-sky-300"
    }`;

  return (
    <nav className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full md:w-1/2 h-20 bg-sky-950/80 backdrop-blur-lg border-t border-sky-800/50 px-8 flex items-center justify-between z-50 shadow-[0_-8px_30px_rgba(8,47,73,0.4)]">
      
      <NavLink to='/' className={navLinkClass}>
        <FaHome className="text-[22px] shrink-0" />
        <span className="text-[10px] font-medium tracking-wide">Home</span>
      </NavLink>

      <NavLink to='/habits' className={navLinkClass}>
        <FaListUl className="text-[20px] shrink-0" />
        <span className="text-[10px] font-medium tracking-wide">Habits</span>
      </NavLink>

      <NavLink to='/profile' className={navLinkClass}>
        <FaUser className="text-[20px] shrink-0" />
        <span className="text-[10px] font-medium tracking-wide">Profile</span>
      </NavLink>

    </nav>
  )
}

export default Navbar;