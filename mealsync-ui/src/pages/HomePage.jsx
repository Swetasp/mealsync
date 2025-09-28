import hero from "../assets/hero.svg"; // <-- add this import at top
import React from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleSignInButton from '../components/GoogleSignInButton.jsx';
import { useAuth } from '../AuthContext.jsx';
import mealSyncLogo from '../assets/mealsync.svg'; 
import subLogo from '../assets/sublogo.svg';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const go = (path) => {
    if (user) navigate(path);
    else navigate('/auth', { state: { from: { pathname: path } } });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={mealSyncLogo} alt="MealSync Logo" className="h-10" />
            <img src={subLogo} alt="sub-logo" className="h-10" />
          </div>
          <div className="flex items-center gap-4">
            {!user && <GoogleSignInButton />}
            <button
              onClick={() => go('/intake')}
              className="hidden sm:inline-flex items-center gap-2 rounded-full px-6 py-3 bg-green-500 text-white font-semibold shadow-md hover:bg-green-600 transition-transform transform hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="mt-16 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            Nourishing Futures, One Meal at a Time
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
            MealSync simplifies access to meal programs. Check eligibility, find meal sites, and schedule pickups with ease. It's fast, private, and built for families like yours.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => go('/sites')}
              className="inline-flex items-center gap-3 rounded-full px-8 py-4 bg-green-500 text-white font-bold shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105"
            >
              Find Meal Sites
            </button>
            <button
              onClick={() => go('/eligibility')}
              className="inline-flex items-center gap-3 rounded-full px-8 py-4 bg-white text-green-500 font-bold shadow-lg border border-green-200 hover:bg-green-50 transition-transform transform hover:scale-105"
            >
              Check Eligibility
            </button>
          </div>
        </section>
        <section className="max-w-6xl mx-auto mt-10">
  <div className="grid grid-cols-1 gap-6">
    {/* LEFT CARD becomes full width */}
    <div className="rounded-3xl bg-white/10 backdrop-blur p-8 shadow-xl">
      {/* ...keep your title, paragraph, buttons here... */}
    </div>
  </div>
</section>
        {/* Feature Cards Section */}
        <section className="mt-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              emoji="💡"
              title="Instant Eligibility"
              desc="Answer a few simple questions to see which meal programs you qualify for."
              onClick={() => go('/eligibility')}
            />
            <FeatureCard
              emoji="🗺️"
              title="Interactive Map"
              desc="Find convenient meal pickup locations near you with an easy-to-use map."
              onClick={() => go('/sites')}
            />
            <FeatureCard
              emoji="📅"
              title="Seamless Scheduling"
              desc="Schedule single or recurring meal pickups that sync with your personal calendar."
              onClick={() => go('/schedule')}
            />
            <FeatureCard
              emoji="🔔"
              title="Smart Reminders"
              desc="Get timely notifications so you never miss a meal pickup."
              onClick={() => go('/intake')}
            />
            <FeatureCard
              emoji="🔒"
              title="Private and Secure"
              desc="Your data is encrypted and protected. We value your privacy and security."
              onClick={() => go('/intake')}
            />
            <FeatureCard
              emoji="🌐"
              title="Community Focused"
              desc="Join a network of families and providers dedicated to ending food insecurity."
              onClick={() => go('/impact')}
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-500">
          <p>© {new Date().getFullYear()} MealSync. All Rights Reserved.</p>
          <p className="mt-2">Built with ❤️ for our community.</p>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({ emoji, title, desc, onClick }) {
  return (
    <div
      onClick={onClick}
      className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer transform hover:-translate-y-2"
    >
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="font-bold text-xl text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{desc}</p>
    </div>
  );
}