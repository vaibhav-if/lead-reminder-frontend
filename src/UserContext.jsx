import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "./config";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/auth/check`);
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/users/logout`);
      setUser(null);
    } catch (error) {
      console.error("Error logging out:");
      return null;
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
