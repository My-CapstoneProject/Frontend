import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

// API endpoints
const API_URL = "/api";

// Add useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Add token validation
const validateToken = async (token) => {
  try {
    const response = await fetch(`${API_URL}/validate`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    return response.ok;
  } catch (err) {
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}/users`, {
        params: { username: credentials.username },
      });

      const users = response.data;
      const user = users[0];

      if (!user || user.password !== credentials.password) {
        throw new Error("Invalid credentials");
      }

      const sanitizedUser = {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        storeId: user.storeId,
      };

      localStorage.setItem("user", JSON.stringify(sanitizedUser));
      setUser(sanitizedUser);
      return sanitizedUser;
    } catch (error) {
      setError("Invalid username or password");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
