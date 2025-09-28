import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import GoogleSignInButton from "../components/GoogleSignInButton.jsx";

export default function SignupPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/intake";

  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true });
    }
  }, [user, loading, from, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-6">
      <div className="max-w-md w-full bg-white/10 backdrop-blur rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-2">Create your account</h1>
        <p className="text-white/90 mb-6">
          Sign in to continue to MealSync. You’ll be redirected back to what you were doing.
        </p>

        <GoogleSignInButton className="w-full justify-center" />

        <p className="mt-6 text-sm text-white/80">
          Or go back <Link to="/" className="underline">home</Link>.
        </p>
      </div>
    </div>
  );
}
