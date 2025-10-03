"use client";
import { useEffect, useState } from "react";

type Loc = {
  id: string;
  slug: string;
  title: string;
  city?: string;
  propertyType: string;
  photos: { url: string; isPrimary: boolean }[];
  tags: { name: string }[];
};

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [style, setStyle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [items, setItems] = useState<Loc[]>([]);

  async function runSearch() {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (city) params.set("city", city);
    if (type) params.set("type", type);
    if (style) params.set("style", style);
    if (tags.length) params.set("tags", tags.join(","));
    const res = await fetch(`/api/search?${params.toString()}`);
    const json = await res.json();
    setItems(json.items || []);
  }

  useEffect(() => { runSearch(); }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Search Production & Filming Locations</h1>

      <div className="grid md:grid-cols-[280px_1fr] gap-6">
        <aside className="border rounded p-3">
          <input className="w-full border rounded px-2 py-1 mb-3" placeholder="Keyword…" value={q} onChange={e=>setQ(e.target.value)} />
          <div className="mb-2">
            <label className="text-sm">City</label>
            <input className="w-full border rounded px-2 py-1" value={city} onChange={e=>setCity(e.target.value)} />
          </div>
          <div className="mb-2">
            <label className="text-sm">Type</label>
            <input className="w-full border rounded px-2 py-1" value={type} onChange={e=>setType(e.target.value)} placeholder="Residential, Commercial, …"/>
          </div>
          <div className="mb-2">
            <label className="text-sm">Style</label>
            <input className="w-full border rounded px-2 py-1" value={style} onChange={e=>setStyle(e.target.value)} placeholder="Modern, Rustic, …"/>
          </div>
          <div className="mb-3">
            <label className="text-sm">Tags (comma-separated)</label>
            <input className="w-full border rounded px-2 py-1" onChange={e=>setTags(e.target.value.split(',').map(s=>s.trim()).filter(Boolean))} />
          </div>
          <button className="w-full bg-black text-white rounded py-2" onClick={runSearch}>Apply Filters</button>
        </aside>

        <section>
          <div className="text-sm text-gray-600 mb-3">{items.length} result(s)</div>
          <div className="grid md:grid-cols-3 gap-4">
            {items.map(it => (
              <a href={`/locations/${it.slug}`} key={it.id} className="border rounded overflow-hidden block">
                <div className="h-40 bg-gray-100" style={{backgroundImage:`url(${it.photos.find(p=>p.isPrimary)?.url || it.photos[0]?.url || ""})`, backgroundSize:"cover", backgroundPosition:"center"}} />
                <div className="p-3">
                  <div className="font-medium">{it.title}</div>
                  <div className="text-sm text-gray-600">{it.propertyType}{it.city ? ` • ${it.city}` : ""}</div>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
