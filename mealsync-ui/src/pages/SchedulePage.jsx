import { useState } from "react";
import api from "../lib/api";

export default function SchedulePage() {
  const [form, setForm] = useState({ family_id:"", site_id:"", pickup_date:"", meal_type:"all" });
  const [out, setOut] = useState(null);

  const update = (k)=> (e)=> setForm(s=>({ ...s, [k]: e.target.value }));

  async function submit(e){
    e.preventDefault();
    try {
      const res = await api.schedulePickup(form);
      setOut(res);
      alert("Pickup scheduled!");
    } catch(e){ alert("Scheduling failed: " + e.message); }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Schedule Pickup</h2>
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
        <input className="input" placeholder="Family ID" value={form.family_id} onChange={update("family_id")} required />
        <input className="input" placeholder="Site ID" value={form.site_id} onChange={update("site_id")} required />
        <input className="input" type="datetime-local" value={form.pickup_date} onChange={update("pickup_date")} required />
        <select className="input" value={form.meal_type} onChange={update("meal_type")}>
          <option value="all">All</option><option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option><option value="supper">Supper</option>
        </select>
        <button className="btn md:col-span-2">Schedule</button>
      </form>
      {out && <pre className="pre">{JSON.stringify(out, null, 2)}</pre>}
    </div>
  );
}
