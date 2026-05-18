import React, { useState } from 'react';
import { updateAuthStateFromToken } from '../hooks/UseAuth';
import backgroundImage from '../assets/images/bgImage3.jpg';
import logo from '../assets/logo.png';
import axios from 'axios';


function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:8080/auth/login', { 
        identifier, // "identifier" could be email || username.
        password 
      });
      const token = res.data.token;
      localStorage.setItem('jwtToken', token);
      updateAuthStateFromToken(token); 
      window.location.href = '/';
      setMessage('Login successful!');
    } catch (err) {
      setMessage('Login failed. Check your credentials.');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center px-4 pt-10 pb-6"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${backgroundImage})`,
      }}
    >
      <img
        src={logo}
        alt="Company Logo"
        className="w-80 md:w-80 -mt-4 mb-6 rounded-full shadow-lg"
      />

      <div className="w-full max-w-md bg-white bg-opacity-90 rounded-lg shadow-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Login</h2>

        <input
          type="text"
          placeholder="Email or Username"
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          className="w-full p-3 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-3 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleLogin}
          className="w-full py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
        >
          Login
        </button>

        {message && (
          <p className="mt-4 text-red-600 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}

export default LoginPage;