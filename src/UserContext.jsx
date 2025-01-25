import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = Cookies.get("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log("inside use effect " + storedUser);
    }
    setLoading(false);
  }, []);

  const fetchUser = async (mobile) => {
    try {
      console.log("inside fetchUser");
      const response = await axios.get(
        `http://localhost:3000/users?mobile=${mobile}`
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("user");
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, fetchUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
