
import React, { createContext, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../mock/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  async function login({ email, password }) {
    const u = await api.login(email, password);
    setUser(u);
    if (u.role === 'client') navigate('/client');
    if (u.role === 'vendor') navigate('/vendor');
    if (u.role === 'admin')  navigate('/admin');
  }

  function logout() {
    setUser(null);
    navigate('/');
  }

  async function register(payload) {
    const u = await api.register(payload);
    setUser(u);
    if (u.role === 'client') navigate('/client');
    if (u.role === 'vendor') navigate('/vendor');
  }

  const value = useMemo(() => ({ user, login, logout, register }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
