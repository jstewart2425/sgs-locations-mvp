"use client";
import { useState } from "react";
import { UploadButton } from "@uploadthing/react";

export default function ListPropertyPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<any>({ features: [], photoUrls: [] });

  function set<K extends string>(k: K, v: any) { setForm((s:any)=>({ ...s, [k]: v })); }

  async function submit() {
    const res = await fetch("/api/property-submissions", {
      method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(form)
    });
    const json = await res.json();
    if (json.ok) { alert("Submitted!"); setStep(1); setForm({ features: [], photoUrls: [] }); }
    else alert(json.error || "Error");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">List Your Property</h1>
      <div className="mb-4">Step {step} of 3</div>

      {step === 1 && (
        <div className="grid gap-3">
          <input className="border rounded px-2 py-2" placeholder="Your Name" onChange={e=>set("ownerName", e.target.value)} />
          <input className="border rounded px-2 py-2" placeholder="Email" onChange={e=>set("ownerEmail", e.target.value)} />
          <input className="border rounded px-2 py-2" placeholder="Phone" onChange={e=>set("ownerPhone", e.target.value)} />
          <input className="border rounded px-2 py-2" placeholder="Property Name" onChange={e=>set("propertyName", e.target.value)} />
          <input className="border rounded px-2 py-2" placeholder="Property Type (Residential, Commercial, Estate…)" onChange={e=>set("propertyType", e.target.value)} />
          <input className="border rounded px-2 py-2" placeholder="Address 1" onChange={e=>set("address1", e.target.value)} />
          <div className="grid grid-cols-3 gap-2">
            <input className="border rounded px-2 py-2" placeholder="City" onChange={e=>set("city", e.target.value)} />
            <input className="border rounded px-2 py-2" placeholder="State" onChange={e=>set("state", e.target.value)} />
            <input className="border rounded px-2 py-2" placeholder="ZIP" onChange={e=>set("zip", e.target.value)} />
          </div>
          <textarea className="border rounded px-2 py-2" rows={4} placeholder="Description" onChange={e=>set("description", e.target.value)} />
          <button className="bg-black text-white rounded px-4 py-2" onClick={()=>setStep(2)}>Save & Continue</button>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-3">
          <div className="text-sm">Upload at least 5 high-quality photos</div>
          <UploadButton endpoint="locationPhotos"
            onClientUploadComplete={(res)=> set("photoUrls", [...form.photoUrls, ...res.map(r=>r.url)])}
            onUploadError={(e)=> alert(e.message)}
          />
          <div className="grid grid-cols-3 gap-2">
            {form.photoUrls?.map((u:string)=> <img key={u} src={u} className="w-full h-24 object-cover border rounded" />)}
          </div>
          <button className="border rounded px-4 py-2" onClick={()=>setStep(1)}>Back</button>
          <button className="bg-black text-white rounded px-4 py-2" onClick={()=>setStep(3)}>Continue</button>
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-3">
          <div className="text-sm">Features (comma-separated)</div>
          <input className="border rounded px-2 py-2" onChange={e=>set("features", e.target.value.split(",").map((s:string)=>s.trim()).filter(Boolean))} />
          <div className="flex gap-2">
            <button className="border rounded px-4 py-2" onClick={()=>setStep(2)}>Back</button>
            <button className="bg-black text-white rounded px-4 py-2" onClick={submit}>Submit for Review</button>
          </div>
        </div>
      )}
    </div>
  );
}
