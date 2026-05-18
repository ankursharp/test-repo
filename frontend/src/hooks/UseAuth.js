import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

let setAuthState;

export function useAuth() {
  const [auth, setAuth] = useState({ token: null, email: null, role: null });
  const [loading, setLoading] = useState(true);
  setAuthState = setAuth;

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAuth({
          token,
          email: decoded.sub,
          role: decoded.role
        });
      } catch (err) {
        console.error('Invalid token', err);
      }
    }
    setLoading(false);
  }, []);

  return { ...auth, loading };
}

export function updateAuthStateFromToken(token) {
  const decoded = jwtDecode(token);
  setAuthState({
    token,
    email: decoded.sub,
    role: decoded.role
  });
}
