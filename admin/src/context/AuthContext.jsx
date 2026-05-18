import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminAuthToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminAuthToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminAuthToken');
    const storedUser = localStorage.getItem('adminUser');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signin = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/auth/signin', { email, password });
      const { token, user } = response.data;
      
      if (user.role !== 'admin') {
        setError('Only admins can access this dashboard');
        throw new Error('Not an admin user');
      }
      
      localStorage.setItem('adminAuthToken', token);
      localStorage.setItem('adminUser', JSON.stringify(user));
      setUser(user);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Signin failed';
      setError(message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminAuthToken');
    localStorage.removeItem('adminUser');
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    signin,
    logout,
    api
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
