import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "./auth.store";

export default function GuestGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}
