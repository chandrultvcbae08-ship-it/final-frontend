import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTokens = localStorage.getItem('mediconnect_tokens');
    const savedUser = localStorage.getItem('mediconnect_user');

    if (savedTokens && savedUser) {
      try {
        setTokens(JSON.parse(savedTokens));
        setUser(JSON.parse(savedUser));
        // Verify with server in background
        authApi.getCurrentUser()
          .then((res) => {
            setUser(res.data);
            localStorage.setItem('mediconnect_user', JSON.stringify(res.data));
          })
          .catch(() => {
            // Token might be invalid
          })
          .finally(() => setLoading(false));
      } catch (e) {
        localStorage.removeItem('mediconnect_tokens');
        localStorage.removeItem('mediconnect_user');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    const { user: userData, tokens: tokenData } = response.data;
    setUser(userData);
    setTokens(tokenData);
    localStorage.setItem('mediconnect_user', JSON.stringify(userData));
    localStorage.setItem('mediconnect_tokens', JSON.stringify(tokenData));
    return userData;
  };

  const registerPatient = async (data) => {
    const response = await authApi.registerPatient(data);
    const { user: userData, tokens: tokenData } = response.data;
    setUser(userData);
    setTokens(tokenData);
    localStorage.setItem('mediconnect_user', JSON.stringify(userData));
    localStorage.setItem('mediconnect_tokens', JSON.stringify(tokenData));
    return userData;
  };

  const registerDoctor = async (data) => {
    const response = await authApi.registerDoctor(data);
    const { user: userData, tokens: tokenData } = response.data;
    setUser(userData);
    setTokens(tokenData);
    localStorage.setItem('mediconnect_user', JSON.stringify(userData));
    localStorage.setItem('mediconnect_tokens', JSON.stringify(tokenData));
    return userData;
  };

  const logout = async () => {
    try {
      if (tokens?.refresh) {
        await authApi.logout(tokens.refresh);
      }
    } catch (e) {
      // Ignore logout errors
    } finally {
      setUser(null);
      setTokens(null);
      localStorage.removeItem('mediconnect_user');
      localStorage.removeItem('mediconnect_tokens');
    }
  };

  const updateUser = (updatedData) => {
    setUser(updatedData);
    localStorage.setItem('mediconnect_user', JSON.stringify(updatedData));
  };

  const isPatient = user?.role === 'PATIENT';
  const isDoctor = user?.role === 'DOCTOR';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        loading,
        login,
        registerPatient,
        registerDoctor,
        logout,
        updateUser,
        isPatient,
        isDoctor,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
