import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/UseAuth';

function Navbar() {
  const { token, role } = useAuth();
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    window.location.href = '/login';
  };


  return (
    <nav className="flex justify-between items-center px-8 py-3 bg-gray-900 shadow-md">
      {/* Left Links */}
      <div className="flex space-x-6">
        <Link to="/" className="text-white font-medium hover:underline">
          Home
        </Link>

        {isLoggedIn && (
          <Link to="/clients" className="text-white font-medium hover:underline">
            Clients
          </Link>
        )}

        {isLoggedIn && role === 'ADMIN' && (
          <Link to="/admin" className="text-white font-medium hover:underline">
            Admin
          </Link>
        )}
      </div>

      {/* Right Links */}
      <div className="flex space-x-6">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="text-white font-medium hover:underline">
              Login
            </Link>
            <Link to="/register" className="text-white font-medium hover:underline">
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="text-white border border-white px-4 py-1 rounded hover:bg-white hover:text-gray-900 transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
