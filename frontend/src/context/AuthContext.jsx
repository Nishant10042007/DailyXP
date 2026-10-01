import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('dailyxp_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Setup axios default config
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
  });

  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        setUser({
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          xp: res.data.totalXP,
          level: res.data.level,
          badges: res.data.badges || []
        });
      } catch (err) {
        console.error('Error fetching user', err);
        setToken(null);
        localStorage.removeItem('dailyxp_token');
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      setToken(res.data.token);
      localStorage.setItem('dailyxp_token', res.data.token);
      setUser({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        xp: res.data.totalXP,
        level: res.data.level,
        badges: res.data.badges || []
      });
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      setToken(res.data.token);
      localStorage.setItem('dailyxp_token', res.data.token);
      setUser({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        xp: res.data.totalXP,
        level: res.data.level,
        badges: res.data.badges || []
      });
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('dailyxp_token');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, loading, error, login, register, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
};
