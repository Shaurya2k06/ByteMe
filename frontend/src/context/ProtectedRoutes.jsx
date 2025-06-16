import React from "react";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router";
import { Outlet } from "react-router";

function ProtectedRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div>...Loading</div>;
  if (!user) return <Navigate to="/" replace />;
  console.log("HAHA CAUGHT");
  return <Outlet />;
}

export default ProtectedRoutes;
