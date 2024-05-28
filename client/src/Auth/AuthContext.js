import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001',
    withCredentials: true
  });
 
    const checkAuthStatus = async () => {
      try {
        const response = await axiosInstance.get('/auth/status');
        setUser(response.data.user);
      } catch (error) {   
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
  
useEffect(() => {
    checkAuthStatus();
},[]);

  const login = async (username, password) => {
    await axiosInstance.post('/auth/login', { username, password });
    await checkAuthStatus();
  };

  const logout = async () => {
    await axiosInstance.post('/auth/logout');
    setUser(null)
    await checkAuthStatus();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
