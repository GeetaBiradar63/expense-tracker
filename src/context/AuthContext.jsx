import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('finance_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login - Accept any email/password for demo
    // In real app, validate against DB
    const mockUser = { id: 1, name: 'Demo User', email };
    setUser(mockUser);
    localStorage.setItem('finance_user', JSON.stringify(mockUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('finance_user');
  };

  const register = (name, email, password) => {
    const mockUser = { id: 1, name, email };
    setUser(mockUser);
    localStorage.setItem('finance_user', JSON.stringify(mockUser));
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
