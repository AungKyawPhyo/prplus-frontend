// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  // Render either explicit children or nested Outlet
  return <>{children ?? <Outlet />}</>;
}