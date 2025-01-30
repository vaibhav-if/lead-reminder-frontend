import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const SERVER_PORT = process.env.SERVER_PORT;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      console.log("inside fetchUser");
      const response = await axios.get(`${SERVER_URL}/auth/check`);
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${SERVER_URL}/logout`);
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
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
