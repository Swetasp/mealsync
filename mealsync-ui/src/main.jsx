// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import { AuthProvider } from "./AuthContext.jsx";
import ProtectedRoute from "./lib/ProtectedRoute.jsx";

import App from "./App.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import IntakePage from "./pages/IntakePage.jsx";
import EligibilityPage from "./pages/EligibilityPages.jsx"; // keep exact name
import SitesPage from "./pages/SitesPage.jsx";
import SchedulePage from "./pages/SchedulePage.jsx";
import ImpactPage from "./pages/ImpactPage.jsx";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/signup", element: <SignupPage /> },
  {
    path: "/intake",
    element: (
      <ProtectedRoute>
        <IntakePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/eligibility",
    element: (
      <ProtectedRoute>
        <EligibilityPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/sites",
    element: (
      <ProtectedRoute>
        <SitesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/schedule",
    element: (
      <ProtectedRoute>
        <SchedulePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/impact",
    element: (
      <ProtectedRoute>
        <ImpactPage />
      </ProtectedRoute>
    ),
  },
  { path: "*", element: <SignupPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
