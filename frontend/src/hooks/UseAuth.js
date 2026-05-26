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
        const nowSeconds = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < nowSeconds) {
          console.warn('JWT expired, clearing auth state');
          sessionStorage.removeItem('jwtMeta');
        } else {
          setAuth({
            token: parsed.token,
            email: decoded.sub,
            role: decoded.role
          });
        }
      } catch (err) {
        console.error('Invalid token metadata', err);
        sessionStorage.removeItem('jwtMeta');
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
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (decoded.exp && decoded.exp < nowSeconds) {
    console.warn('Attempted to set expired JWT, ignoring');
    return;
  }
  setAuthState({
    token,
    email: decoded.sub,
    role: decoded.role
  });
}
