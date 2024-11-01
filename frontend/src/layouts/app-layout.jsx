import ProtectedRoutes from "@/components/ProtectedRoutes";
import React from "react";
import { Navigate } from "react-router-dom";

const AppLayout = () => {
  const isLoggedIn = localStorage.getItem("loggedIn");
  return isLoggedIn ? <ProtectedRoutes /> : <Navigate to={"/"} replace />;
};

export default AppLayout;
