import { createContext, useContext, useState } from 'react';

// Owner: Manvendra. Holds the logged-in user and token for the whole app.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
