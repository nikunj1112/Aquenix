import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/db.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkLogin = async () => {
    try {
      // Check localStorage first for persisted login
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
      
      // Then verify with backend
      const res = await api.get("/auth/check-login", {
        withCredentials: true
      });

      if (res.data.loggedIn) {
        const userData = {
          id: res.data.user.id,
          email: res.data.user.email,
          role: res.data.user.role,
          name: res.data.user.name
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", res.data.token || token);
      } else {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.log("Auth check error:", error);
      // If there's an error, try to use stored user data
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (token) {
      localStorage.setItem("token", token);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/signout", {}, { withCredentials: true });
    } catch (error) {
      console.log("Logout error:", error);
    }
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, checkLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

