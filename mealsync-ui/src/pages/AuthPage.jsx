import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GoogleSignInButton from "../components/GoogleSignInButton.jsx";
import { useAuth } from "../AuthContext.jsx";

export default function AuthPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  React.useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 text-white grid place-items-center px-6">
      <div className="max-w-md w-full bg-white/10 backdrop-blur p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Sign in to MealSync</h1>
        <p className="text-white/85 mb-6">
          Use your Google account to continue.
        </p>
        <GoogleSignInButton className="w-full" />
      </div>
    </div>
  );
}
