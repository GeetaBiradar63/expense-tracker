import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for token/user
    const storedUser = localStorage.getItem('finance_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);

      setUser(data.user);
      localStorage.setItem('finance_user', JSON.stringify(data.user)); // Keep for session persistence
      return true;
    } catch (error) {
      console.error(error);
      alert(error.message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('finance_user');
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);

      setUser(data.user);
      localStorage.setItem('finance_user', JSON.stringify(data.user));
      return true;
    } catch (error) {
      console.error(error);
      alert(error.message);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
