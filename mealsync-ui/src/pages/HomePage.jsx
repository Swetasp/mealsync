import React from "react";
import { useNavigate } from "react-router-dom";
import GoogleSignInButton from "../components/GoogleSignInButton.jsx";
import { useAuth } from "../AuthContext.jsx";

/** Inline logo (you can swap to /assets/logo.svg anytime) */
function MealSyncLogo({ className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-3xl">🍎</span>
      <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
        MealSync <span className="text-base font-semibold opacity-80">A2A</span>
      </span>
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Auth gate: if not signed in, take them to /auth and remember intent
  const go = (path) => {
    if (user) navigate(path);
    else navigate("/auth", { state: { from: { pathname: path } } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-fuchsia-600 text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="flex items-center justify-between">
        <img src="mealsync-ui/src/pages/mealsync.svg" alt="MealSync" className="h-8 sm:h-10" />
          <div className="flex gap-3">
            {!user && <GoogleSignInButton />}
            <button
              onClick={() => go("/intake")}
              className="hidden sm:inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-white/90 text-gray-900 font-semibold hover:bg-white transition"
            >
              Create account
            </button>
          </div>
        </header>

        {/* Hero / Intro */}
        <section className="mt-10 grid lg:grid-cols-2 gap-8 items-center">
          <div className="bg-white/10 backdrop-blur rounded-3xl p-8 shadow-xl border border-white/10">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Access healthy meals for your family
            </h1>
            <p className="mt-4 text-white/90 text-lg">
              Check eligibility, find nearby sites, and schedule pickups with reminders.
              Private, fast, and friendly—no judgment, just support.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => go("/sites")}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-white text-gray-900 font-semibold hover:opacity-90 transition"
              >
                Find nearby sites
              </button>
              <button
                onClick={() => go("/eligibility")}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-white/20 text-white backdrop-blur border border-white/30 hover:bg-white/25 transition"
              >
                Check eligibility
              </button>
            </div>

            {!user && (
              <p className="mt-4 text-sm text-white/85">
                You’ll be asked to sign in before continuing.
              </p>
            )}
          </div>

          {/* Simple “illustration” panel (replace with an image if you like) */}
          <div className="bg-white/10 backdrop-blur rounded-3xl p-8 shadow-xl border border-white/10">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl h-28 bg-white/90" />
              <div className="rounded-2xl h-28 bg-white/70" />
              <div className="rounded-2xl h-28 bg-white/70" />
              <div className="rounded-2xl h-28 bg-white/90" />
            </div>
            <p className="mt-4 text-white/90">
              A single place to apply, schedule pickups, and stay on track.
            </p>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="mt-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              emoji="💰"
              title="Maximize Benefits"
              desc="Identify all programs you may qualify for."
              onClick={() => go("/eligibility")}
            />
            <FeatureCard
              emoji="📝"
              title="Simple Application"
              desc="We pre-fill what we can and guide you—fast."
              onClick={() => go("/intake")}
            />
            <FeatureCard
              emoji="📍"
              title="Find Nearby Sites"
              desc="See locations and hours quickly."
              onClick={() => go("/sites")}
            />
            <FeatureCard
              emoji="📅"
              title="Schedule Pickups"
              desc="Add pickups to your calendar with reminders."
              onClick={() => go("/schedule")}
            />
            <FeatureCard
              emoji="🔐"
              title="Private & Secure"
              desc="Your information is protected and never sold."
              onClick={() => go("/intake")}
            />
            <FeatureCard
              emoji="🌍"
              title="Multiple Languages"
              desc="Help in English, Spanish, and more."
              onClick={() => go("/intake")}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-white/80 text-sm">
          © {new Date().getFullYear()} MealSync • Built with love for families
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({ emoji, title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left w-full rounded-2xl bg-white/10 hover:bg-white/15 transition p-6 border border-white/10"
    >
      <div className="text-3xl mb-2">{emoji}</div>
      <div className="font-semibold text-white">{title}</div>
      <div className="text-white/85 mt-1">{desc}</div>
    </button>
  );
}
// Made with ❤️ by the MealSync team.