import { Link } from "react-router-dom";
import logo from "./assets/sublogo.svg";
import GoogleSignInButton from "./components/GoogleSignInButton.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <img src={logo} alt="MealSync" className="h-8 sm:h-10" />
          <div className="flex gap-3">
            <GoogleSignInButton />
            <Link
              to="/signup"
              className="inline-flex items-center rounded-xl px-4 py-2 bg-white/90 text-gray-900 font-semibold hover:bg-white transition"
            >
              Create account
            </Link>
          </div>
        </div>

        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur rounded-3xl p-8 shadow-xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Access healthy<br/> meals for your family
            </h1>
            <p className="mt-4 text-white/90">
              Check eligibility, find nearby sites, and schedule pickups with reminders.
              Private, fast, and friendly—no judgment, just support.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/sites" className="btn">Find nearby sites</Link>
              <Link to="/eligibility" className="btn bg-white/70 text-gray-900 hover:bg-white">
                Check eligibility
              </Link>
            </div>
            <p className="mt-2 text-sm text-white/70">
              You’ll be asked to sign in before continuing.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-3xl p-8 shadow-xl">
            {/* simple placeholder; keep or replace with illustration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 rounded-2xl bg-white/30" />
              <div className="h-24 rounded-2xl bg-white/30" />
              <div className="h-24 rounded-2xl bg-white/30" />
              <div className="h-24 rounded-2xl bg-white/30" />
            </div>
            <p className="mt-3 text-white/80">
              A single place to apply, schedule pickups, and stay on track.
            </p>
          </div>
        </div>

        {/* Feature cards */}
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <FeatureCard to="/eligibility" emoji="💰" title="Maximize Benefits"
            desc="Identify all programs you may qualify for." />
          <FeatureCard to="/intake" emoji="📝" title="Simple Application"
            desc="We pre-fill what we can and guide you—fast." />
          <FeatureCard to="/sites" emoji="📍" title="Find Nearby Sites"
            desc="See locations and hours quickly." />
          <FeatureCard to="/schedule" emoji="📅" title="Schedule Pickups"
            desc="Add pickups with reminders." />
          <FeatureCard to="/intake" emoji="🔐" title="Private & Secure"
            desc="Your info is protected and never sold." />
          <FeatureCard to="/sites" emoji="🌍" title="Multiple Languages"
            desc="Help in English, Spanish, and more." />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ to, emoji, title, desc }) {
  return (
    <Link
      to={to}
      className="block bg-white/10 hover:bg-white/15 transition rounded-3xl p-6 shadow-lg"
    >
      <div className="text-3xl mb-3">{emoji}</div>
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-white/80 mt-1">{desc}</div>
    </Link>
  );
}
