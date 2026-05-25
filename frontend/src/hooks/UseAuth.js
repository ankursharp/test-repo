import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

let setAuthState;

export function useAuth() {
  const [auth, setAuth] = useState({ token: null, email: null, role: null });
  const [loading, setLoading] = useState(true);
  setAuthState = setAuth;

  useEffect(() => {
    const tokenMeta = sessionStorage.getItem('jwtMeta');
    if (tokenMeta) {
      try {
        const parsed = JSON.parse(tokenMeta);
        const decoded = jwtDecode(parsed.token);
        setAuth({
          token: parsed.token,
          email: decoded.sub,
          role: decoded.role
        });
      } catch (err) {
        console.error('Invalid token metadata', err);
      }
    }
    setLoading(false);
  }, []);

  return { ...auth, loading };
}

export function updateAuthStateFromToken(token) {
  const decoded = jwtDecode(token);
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('jwtMeta', JSON.stringify({ token }));
  }
  setAuthState({
    token,
    email: decoded.sub,
    role: decoded.role
  });
}
