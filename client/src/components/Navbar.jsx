import React, { useContext, useState } from 'react';
import { Search, Sun, MoonStar, MessageSquareText, Bell, User, LogOut, Menu } from 'lucide-react';
import { Link } from 'react-router';
import { useTheme } from '@mui/material/styles';
import ColorModeContext from '../context/ColorModeContext';
import { logoutUser } from '../utils';

function Navbar() {
  const [userName, setUsername] = useState({}); 
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const isDarkMode = theme.palette.mode === 'dark';
  const background = theme.palette.background.default;
  const textColor = theme.palette.text.primary;
  const inputBackground = theme.palette.background.alt || theme.palette.background.paper;

  return (
    <div
      className="py-3 px-3 md:px-10 flex items-center justify-between border-b-2 sticky top-0 z-40"
      style={{ backgroundColor: background, color: textColor }}
    >
      <Link to={`/home`} className="text-xl md:text-2xl text-blue-400 font-bold cursor-pointer shrink-0">
        SocialMediaGram
      </Link>

      <div 
        className="hidden md:flex items-center border-2 rounded-xl overflow-hidden" 
        style={{ borderColor: theme.palette.divider }}
      >
        <input
          type="text"
          placeholder="Search"
          className="px-3 py-1 border-none focus:outline-none w-40 lg:w-64"
          style={{
            backgroundColor: inputBackground,
            color: textColor,
          }}
        />
        <div className='p-2 bg-gray-100/10 cursor-pointer'>
           <Search size={18} />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div onClick={colorMode.toggleColorMode} className="cursor-pointer p-1.5 hover:bg-gray-500/10 rounded-full">
          {isDarkMode ? <Sun size={25} /> : <MoonStar size={25} />}
        </div>

        <div className="flex items-center gap-2 md:gap-5">
            <Bell size={25} className="cursor-pointer" />
            <User size={25} className="cursor-pointer hidden sm:block" />
        </div>

        {userName ? (
          <button 
            onClick={() => logoutUser()} 
            className="flex items-center gap-1 font-medium hover:text-red-400 transition"
            style={{ color: textColor }}
          >
            <span className="hidden md:inline">Logout</span>
            <LogOut size={20} className="md:hidden" />
          </button>
        ) : (
          <Link to='/' className="font-medium" style={{ color: textColor }}>
            Login
          </Link>
        )}

        <Search size={22} className="md:hidden cursor-pointer" />
      </div>
    </div>
  );
}

export default Navbar;