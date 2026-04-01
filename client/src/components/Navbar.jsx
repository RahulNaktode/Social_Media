import React, { useContext, useEffect, useState } from 'react';
import { Search, Sun, MoonStar, MessageSquareText, Bell, User } from 'lucide-react';
import { Link } from 'react-router';
import { useTheme } from '@mui/material/styles';
import ColorModeContext from '../context/ColorModeContext';
import Button from './Button';
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
      className="py-3 px-5 flex items-center justify-around border-b-2"
      style={{ backgroundColor: background, color: textColor }}
    >
      <Link to={`/home`} className="text-2xl text-blue-400 font-bold cursor-pointer">SocialInsta</Link>

      <div className="flex items-center border-2 rounded-xl" style={{ borderColor: theme.palette.divider }}>
        <input
          type="text"
          placeholder="Search"
          className="px-2 py-0.5 rounded-l-xl border-none focus:outline-none"
          style={{
            backgroundColor: inputBackground,
            color: textColor,
          }}
        />
        <Search className="px-1" size={18} />
      </div>

      <div className="flex items-center gap-5">
        {isDarkMode ? (
          <Sun size={20} className="cursor-pointer" onClick={colorMode.toggleColorMode} />
        ) : (
          <MoonStar size={20} className="cursor-pointer" onClick={colorMode.toggleColorMode} />
        )}

        <MessageSquareText size={22} />
        <Bell size={22} />
        <User size={22} />

        {userName ? (
          <button onClick={() => logoutUser()} style={{ color: textColor }}>
            Logout
          </button>
        ): (
          <Link to='/'  style={{ color: textColor }}>Login</Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
