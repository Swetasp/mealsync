import { useState } from "react";
import api from "../lib/api";

export default function IntakePage() {
  const [form, setForm] = useState({
    address: "", school_name: "", family_size: 1,
    contact_email: "", contact_phone: "", preferred_language: "en",
    children_ages: [7, 10],
  });
  const [out, setOut] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm(s => ({ ...s, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.intake({ ...form, family_size: Number(form.family_size) });
      setOut(res);
    } catch (e) {
      alert("Intake failed: " + e.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Start Application</h2>
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
        <input className="input" placeholder="Address" value={form.address} onChange={update("address")} required />
        <input className="input" placeholder="School name" value={form.school_name} onChange={update("school_name")} required />
        <input className="input" type="number" min="1" placeholder="Family size" value={form.family_size} onChange={update("family_size")} required />
        <input className="input" type="email" placeholder="Email" value={form.contact_email} onChange={update("contact_email")} required />
        <input className="input" placeholder="Phone (optional)" value={form.contact_phone} onChange={update("contact_phone")} />
        <select className="input" value={form.preferred_language} onChange={update("preferred_language")}>
          <option value="en">English</option><option value="es">Español</option><option value="zh">中文</option>
        </select>
        <button className="btn md:col-span-2" disabled={loading}>
          {loading ? "Submitting..." : "Start Intake"}
        </button>
      </form>

      {out && (
        <pre className="pre mt-4">{JSON.stringify(out, null, 2)}</pre>
      )}
    </div>
  );
}
