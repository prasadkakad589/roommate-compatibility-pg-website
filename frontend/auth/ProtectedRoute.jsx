import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider.jsx";
import { PageLoader } from "../components/ui/PageLoader.jsx";

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};
