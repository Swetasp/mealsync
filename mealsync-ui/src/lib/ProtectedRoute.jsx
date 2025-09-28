// src/lib/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or spinner
  if (!user) return <Navigate to="/signup" replace state={{ from: location }} />;
  return children;
}
