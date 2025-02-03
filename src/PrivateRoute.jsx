import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user, loading } = useUser();
  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
