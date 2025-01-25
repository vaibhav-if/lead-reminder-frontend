import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user, loading } = useUser();
  console.log(loading);
  if (loading) {
    return <div>Loading...</div>;
  }

  console.log(user ? "User is logged in" : "User is not logged in");

  return user ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
