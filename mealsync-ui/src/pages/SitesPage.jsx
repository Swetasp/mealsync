import { useEffect, useState } from "react";
import api from "../lib/api";

export default function SitesPage() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const pos = await new Promise((res, rej) =>
          navigator.geolocation
            ? navigator.geolocation.getCurrentPosition(p => res(p.coords), rej, { enableHighAccuracy: true })
            : rej(new Error("Geolocation not supported"))
        );
        const out = await api.nearbySites({ lat: pos.latitude, lng: pos.longitude });
        setSites(out.sites || []);
      } catch (e) { setErr(e.message || String(e)); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <p>Finding sites…</p>;
  if (err) return <p className="text-red-200">Error: {err}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Nearby Meal Sites</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {sites.map(s => (
          <div key={s.id || s.name} className="card">
            <div className="font-semibold">{s.name}</div>
            <div className="text-sm opacity-80">{s.address}</div>
            <div className="mt-2 text-sm">{(s.meal_types || []).join(" • ")}</div>
          </div>
        ))}
        {!sites.length && <p>No sites found in this area.</p>}
      </div>
    </div>
  );
}
