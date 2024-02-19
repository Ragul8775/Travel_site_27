// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));
  const [userData, setUserData] = useState(() => {
    // Initially load user data from localStorage if available
    const savedUserData = localStorage.getItem("userData");
    return savedUserData ? JSON.parse(savedUserData) : null;
  });

  useEffect(() => {
    // Set authToken based on localStorage on app load
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      fetchUserData(token);
    }
  }, []);
  const login = (token) => {
    localStorage.setItem("token", token);
    setAuthToken(token); // Update state to reflect login
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setAuthToken(null);
    setUserData(null); // Clear user data on logout
  };

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get("https://dummyjson.com/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
      localStorage.setItem("userData", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
