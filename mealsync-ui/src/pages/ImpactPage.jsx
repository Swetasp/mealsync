import { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

export default function ImpactPage(){
  const [data, setData] = useState(null);
  useEffect(()=> {
    fetch(`${API}/api/impact/dashboard`).then(r => r.json()).then(setData).catch(()=>{});
  }, []);
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Impact Dashboard</h2>
      <pre className="pre">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
