// src/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth, signIn as fbSignIn, signOut as fbSignOut } from "./firebase";
import { onAuthStateChanged, getIdToken } from "firebase/auth";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Optional: fetch an ID token if you want to call your FastAPI with auth
        try {
          const token = await getIdToken(u, /*forceRefresh*/ false);
          // window.localStorage.setItem("id_token", token); // if you plan to send it
        } catch {}
        setUser(u);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function signIn() {
    await fbSignIn();
  }

  async function signOut() {
    await fbSignOut();
  }

  return (
    <AuthCtx.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
