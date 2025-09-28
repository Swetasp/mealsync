// src/components/GoogleSignInButton.jsx
import { useAuth } from "../AuthContext.jsx";
import { useLocation, useNavigate } from "react-router-dom";

export default function GoogleSignInButton({ className = "" }) {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/intake"; // default landing

  async function handleClick() {
    try {
      await signIn();
      navigate(from, { replace: true });
    } catch (e) {
      console.error("Sign-in failed:", e);
      alert("Sign-in failed. Check console for details.");
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-white text-gray-900 font-semibold shadow hover:bg-gray-100 transition ${className}`}
    >
      <img
        alt=""
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        className="h-5 w-5"
      />
      Sign in with Google
    </button>
  );
}
