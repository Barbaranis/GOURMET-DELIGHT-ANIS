// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';


const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';


export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);     // { id, email, role, prenom }
  const [token, setToken] = useState(null);   // marqueur; le JWT est en cookie httpOnly
  const [loading, setLoading] = useState(true);


  // --- récupère un token CSRF et le renvoie
  const ensureCsrf = useCallback(async () => {
    const r = await fetch(`${API}/api/csrf-token`, { credentials: 'include' });
    if (!r.ok) throw new Error('CSRF fetch failed');
    const { csrfToken } = await r.json();
    return csrfToken;
  }, []);


  // ↻ Récupère l'utilisateur (cookie httpOnly)
  const refreshMe = useCallback(async () => {
    try {
      const r = await fetch(`${API}/api/auth/me`, { credentials: 'include' });
      if (r.ok) {
        const data = await r.json();
        setUser(data.user || data);
        setToken('cookie');
      } else {
        setUser(null);
        setToken(null);
      }
    } catch {
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => { refreshMe(); }, [refreshMe]);


  const login = (userData) => {
    setUser(userData);
    setToken('cookie');
    localStorage.setItem('user', JSON.stringify(userData));
  };


  const logout = async () => {
    try {
      const csrfToken = await ensureCsrf(); // ← important
      await fetch(`${API}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': csrfToken,
          'Content-Type': 'application/json'
        }
      });
    } catch (e) {
      // optionnel: console.warn(e);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
    }
  };


  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshMe }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);

