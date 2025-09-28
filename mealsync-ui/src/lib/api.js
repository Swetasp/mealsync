const API = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

async function j(res) {
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  health: () => fetch(`${API}/health`).then(j),

  intake: (data) =>
    fetch(`${API}/api/intake`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(j),

  eligibilityCheck: (data) =>
    fetch(`${API}/api/eligibility/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(j),

  nearbySites: ({ lat, lng, radius_miles = 5, meal_type = "" }) => {
    const q = new URLSearchParams({
      latitude: lat, longitude: lng,
      radius_miles: String(radius_miles),
      ...(meal_type ? { meal_type } : {}),
    });
    return fetch(`${API}/api/sites/nearby?${q.toString()}`).then(j);
  },

  schedulePickup: (data) =>
    fetch(`${API}/api/calendar/schedule?` + new URLSearchParams(data), {
      method: "POST",
    }).then(j),
};

export default api;
