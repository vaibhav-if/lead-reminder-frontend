import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const SERVER_PORT = process.env.SERVER_PORT;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    name: "",
    mobile: "",
    email: "",
    referral: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = Cookies.get("user");
    console.log("inside use effect " + storedUser);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log("inside use effect " + storedUser);
    }
    setLoading(false);
  }, []);

  const fetchUser = async (mobile) => {
    try {
      console.log("inside fetchUser");
      const response = await axios.get(`${SERVER_URL}/users?mobile=${mobile}`);
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
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
