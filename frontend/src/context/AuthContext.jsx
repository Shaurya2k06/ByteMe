import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:9092/user/getMe", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const userId = response.data.user._id;
        if (userId) {
          setUser(userId);
        }
      } catch (err) {
        console.log("Not authenticated:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
