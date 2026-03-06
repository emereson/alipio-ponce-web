import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "./auth.store";

export function PrivateGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/log-in" replace />;
}
