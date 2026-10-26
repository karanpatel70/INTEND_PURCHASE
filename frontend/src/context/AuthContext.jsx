import { createContext, useContext, useEffect, useState } from 'react';
import { getMe, login as apiLogin } from '../api/auth.js';

// Owner: Manvendra. Holds the logged-in user for the whole app. The token is kept in localStorage.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // on first load: if a token is saved, ask who it belongs to
  useEffect(() => {
    if (!localStorage.getItem('token')) return setLoading(false);
    getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  async function login(userId, password) {
    const { token, user } = await apiLogin(userId, password); // throws an Error with a message if it fails
    localStorage.setItem('token', token);
    setUser(user);
    return user;
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

    return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
