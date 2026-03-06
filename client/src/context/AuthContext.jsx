import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/db.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkLogin = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      // Agar user localStorage me hai to temporarily set karo
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }

      // Agar token hi nahi hai to backend call avoid karo
      if (!token) {
        setLoading(false);
        return;
      }

      // Backend verification
      const res = await api.get("/auth/check-login");

      if (res.data && res.data.loggedIn) {
        const userData = {
          id: res.data.user.id,
          email: res.data.user.email,
          role: res.data.user.role,
          name: res.data.user.name,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }

      } else {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }

    } catch (error) {
      console.log("Auth check error:", error);

      // Agar backend fail ho jaye to localStorage fallback
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
      await api.post("/auth/signout");
    } catch (error) {
      console.log("Logout error:", error);
    }

    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
        checkLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);