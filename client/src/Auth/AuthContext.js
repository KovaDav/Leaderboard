import React, { createContext, useState, useEffect, useContext } from 'react';


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        fetch(
            `http://localhost:3001/status`,
            {
              method: 'GET',
            })
            .then((response) => response.json())
            .then((result) => {
              setUser(result.user)
            })
            .catch((error) => {
              console.error('Error:', error);
            });
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (username, password) => {
    fetch(
        `http://localhost:3001/auth/login`,
        {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: username, password: password }),
        })
        .then((response) => response.json())
        .then((result) => {
            setUser(result.user)
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  };

  const logout = async () => {
       fetch(
        `http://localhost:3001/logout`,
        {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => response.json())
        .then((result) => {
            setUser(null)
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
