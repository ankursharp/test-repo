import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import newBackground from '../assets/images/bgImage3.jpg';
import logo from '../assets/logo.png';
import axios from 'axios';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:8080/auth/register', {
        email,
        username,
        password
      });
      setMessage('✅ Registration successful! You can now log in.');
      setTimeout(() => {
        navigate('/login');
      }, 600);
    } catch (err) {
      setMessage('❌ Registration failed: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center px-4 pt-10 pb-6"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${newBackground})`,
      }}
    >
      <img
        src={logo}
        alt="Company Logo"
        className="w-80 md:w-80 -mt-4 mb-6 rounded-full shadow-lg"
      />

      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Register</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          onClick={handleRegister}
          className="w-full py-3 mt-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold transition"
        >
          Register
        </button>

        {message && (
          <p className={`mt-4 font-medium text-center ${message.includes('❌') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default RegisterPage;
