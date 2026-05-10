import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { capitalize } from '../../utils/helpers';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        background: '#1f2937',
        color: '#fff',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>
        School SMS
      </Link>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {isAuthenticated && <span>{capitalize(user?.role)} Portal</span>}
        {isAuthenticated && (
          <button type="button" onClick={onLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
