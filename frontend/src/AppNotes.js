import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:8080/auth/login', {
        email: email.trim(),
        password: password.trim()
      });

      const jwt = res.data.token;
      setToken(jwt);
      localStorage.setItem('jwtToken', jwt);
      setMessage('Login successful!');
    } catch (err) {
      setMessage('Login failed.');
      console.error(err);
    }
  };

  const accessClients = async () => {
    try {
      const res = await axios.get('http://localhost:8080/clients', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage('Clients data: ' + JSON.stringify(res.data));
    } catch (err) {
      setMessage('Access denied.');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br />
      <button onClick={handleLogin}>Login</button>

      <h3>{message}</h3>

      {token && (
        <>
          <button onClick={accessClients}>Access /clients</button>
        </>
      )}
    </div>
  );
}

export default App;