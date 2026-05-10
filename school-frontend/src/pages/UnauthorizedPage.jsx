import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const normalizeRoles = (user) => (user?.roles || []).map((role) => String(role).replace(/^ROLE_/, '').toUpperCase());

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect to correct dashboard based on role
  const handleBackToHome = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const roles = normalizeRoles(user);
    if (roles.includes('SUPERADMIN') || roles.includes('ADMIN')) navigate('/admin/dashboard');
    else if (roles.includes('TEACHER')) navigate('/teacher/dashboard');
    else navigate('/student/dashboard');
  };

  return (
    // -- FULL PAGE WRAPPER ----------------------------
    // Same light gray background as login page
    <div
      className="min-h-screen flex items-center 
                 justify-center p-4"
      style={{ backgroundColor: '#e8eaed' }}
    >

      {/* -- CENTER CARD ------------------------------- */}
      {/* White card, rounded, soft shadow - same style as login */}
      <div
        className="bg-white rounded-2xl shadow-lg
                   w-full max-w-sm px-10 py-12
                   flex flex-col items-center text-center"
      >

        {/* -- PADLOCK ICON -------------------------- */}
        {/* Large blue padlock SVG - matches image exactly */}
        <div className="mb-6">
          <svg
            width="90"
            height="90"
            viewBox="0 0 90 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Lock Shackle (the arc on top) */}
            <path
              d="M27 38V30C27 19.507 34.507 12 45 12
                 C55.493 12 63 19.507 63 30V38"
              stroke="#3b82f6"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
            />

            {/* Lock Body (rounded rectangle) */}
            <rect
              x="18"
              y="36"
              width="54"
              height="44"
              rx="6"
              ry="6"
              fill="#3b82f6"
            />

            {/* Keyhole circle (white) */}
            <circle
              cx="45"
              cy="56"
              r="6"
              fill="white"
            />

            {/* Keyhole slot (white rectangle below circle) */}
            <rect
              x="42"
              y="58"
              width="6"
              height="10"
              rx="3"
              fill="white"
            />
          </svg>
        </div>

        {/* -- ACCESS DENIED TEXT -------------------- */}
        <h1
          className="text-3xl font-bold mb-3"
          style={{ color: '#1a1a2e' }}
        >
          Access Denied
        </h1>

        {/* -- SUBTITLE TEXT ------------------------- */}
        <p
          className="text-sm mb-8 leading-relaxed"
          style={{ color: '#6b7280' }}
        >
          You do not have permission to access this page.
        </p>

        {/* -- BACK TO HOME BUTTON ------------------- */}
        {/* Blue, full width, same style as Login button */}
        <button
          onClick={handleBackToHome}
          className="w-full bg-blue-600 hover:bg-blue-700
                     active:bg-blue-800
                     text-white font-semibold
                     py-3 rounded-lg text-sm
                     transition-all duration-200"
        >
          Back to Home
        </button>

      </div>

      {/* -- BOTTOM RIGHT DIAMOND WIDGET --------------- */}
      {/* Same as login page - gray rotated square */}
      <div className="fixed bottom-5 right-5">
        <div
          className="w-10 h-10 bg-gray-500 rotate-45
                     rounded-sm flex items-center
                     justify-center cursor-pointer
                     hover:bg-gray-600 transition-colors
                     shadow-md"
        >
        </div>
      </div>

    </div>
  );
};

export default UnauthorizedPage;
