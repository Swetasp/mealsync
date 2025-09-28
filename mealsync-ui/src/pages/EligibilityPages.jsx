import { useState } from "react";
import api from "../lib/api";

export default function EligibilityPage() {
  const [form, setForm] = useState({ family_id:"", household_income:"", snap_recipient:false, tanf_recipient:false, wic_recipient:false });
  const [out, setOut] = useState(null);

  const update = (k) => (e) => setForm(s => ({ ...s, [k]: e.target.type==="checkbox" ? e.target.checked : e.target.value }));

  async function submit(e){
    e.preventDefault();
    try {
      const res = await api.eligibilityCheck({
        ...form,
        household_income: form.household_income ? Number(form.household_income) : null
      });
      setOut(res);
    } catch(e){ alert("Check failed: " + e.message); }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Check Eligibility</h2>
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
        <input className="input md:col-span-2" placeholder="Family ID (from intake response)" value={form.family_id} onChange={update("family_id")} required />
        <input className="input" type="number" placeholder="Household annual income" value={form.household_income} onChange={update("household_income")} />
        <label className="label"><input type="checkbox" checked={form.snap_recipient} onChange={update("snap_recipient")} /> SNAP</label>
        <label className="label"><input type="checkbox" checked={form.tanf_recipient} onChange={update("tanf_recipient")} /> TANF</label>
        <label className="label"><input type="checkbox" checked={form.wic_recipient} onChange={update("wic_recipient")} /> WIC</label>
        <button className="btn md:col-span-2">Check</button>
      </form>
      {out && <pre className="pre">{JSON.stringify(out, null, 2)}</pre>}
    </div>
  );
}
