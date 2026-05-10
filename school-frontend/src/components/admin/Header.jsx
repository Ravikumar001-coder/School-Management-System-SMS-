import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  AiOutlineMenu,
  AiOutlineMail,
  AiOutlineBell,
} from 'react-icons/ai';

const Header = ({ onMenuClick = () => {} }) => {
  const { logout } = useAuth();
  const navigate   = useNavigate();
  const [search, setSearch] = useState('School');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    // White top bar
    <div
      className="fixed top-0 left-0 md:left-56 right-0 h-14 bg-white
                 flex items-center justify-between px-5 z-10"
      style={{ borderBottom: '1px solid #e5e7eb' }}
    >

      {/* -- LEFT SIDE -------------------------------- */}
      <div className="flex items-center gap-3">
        {/* Hamburger menu icon */}
        <button
          onClick={onMenuClick}
          className="text-gray-500 hover:text-gray-700
                     transition-colors p-1"
        >
          <AiOutlineMenu size={20} />
        </button>

        {/* Search input */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-gray-100 text-gray-600 text-sm
                     px-4 py-1.5 rounded-md w-40
                     focus:outline-none focus:bg-gray-200
                     transition-colors"
          placeholder="Search..."
        />
      </div>

      {/* -- RIGHT SIDE ------------------------------- */}
      <div className="flex items-center gap-4">

        {/* Email icon */}
        <button
          className="text-gray-500 hover:text-gray-700
                     transition-colors relative"
        >
          <AiOutlineMail size={22} />
        </button>

        {/* Bell icon with red badge */}
        <button
          className="text-gray-500 hover:text-gray-700
                     transition-colors relative"
        >
          <AiOutlineBell size={22} />
          {/* Red notification dot */}
          <span
            className="absolute -top-1 -right-1 w-4 h-4
                       bg-red-500 rounded-full text-white
                       text-xs flex items-center justify-center
                       font-bold"
          >
            1
          </span>
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden
                        border-2 border-gray-200 cursor-pointer">
          <img
            src="https://i.pravatar.cc/40?img=3"
            alt="admin"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300"></div>

        {/* Log Out button */}
        <button
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:text-gray-900
                     font-medium transition-colors"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Header;
