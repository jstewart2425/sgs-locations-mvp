"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Loc = {
  id: string;
  slug: string;
  title: string;
  city?: string;
  propertyType: string;
  photos: { url: string; isPrimary: boolean }[];
  tags: { name: string }[];
};

function toCSV(arr: string[]) {
  return arr.join(",");
}
function fromCSV(csv?: string | null) {
  if (!csv) return [];
  return csv.split(",").map((s) => s.trim()).filter(Boolean);
}

// --- Export a wrapper that provides Suspense ---
export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-8">Loading search…</div>}>
      <SearchPage />
    </Suspense>
  );
}

// --- Your original page component moved below ---
function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- Initialize state from URL params on first render ---
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [style, setStyle] = useState(searchParams.get("style") || "");
  const [tags, setTags] = useState<string[]>(fromCSV(searchParams.get("tags")));

  const [items, setItems] = useState<Loc[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Build a stable query string from current filters
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (city) params.set("city", city);
    if (type) params.set("type", type);
    if (style) params.set("style", style);
    if (tags.length) params.set("tags", toCSV(tags));
    return params.toString();
  }, [q, city, type, style, tags]);

  async function runSearch(pushUrl = true) {
    try {
      setLoading(true);
      setErr(null);
      if (pushUrl) {
        // keep URL in sync so you can share/bookmark
        router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, { scroll: false });
      }
      const res = await fetch(`/api/search?${queryString}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Search failed (${res.status})`);
      const json = await res.json();
      setItems(json.items || []);
    } catch (e: any) {
      setErr(e?.message || "Search failed");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  // Run an initial search (based on URL) on mount
  useEffect(() => {
    // On first load only; we already seeded state from URL
    runSearch(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Controlled text for tags input (so typing shows in the box)
  const [tagsText, setTagsText] = useState(searchParams.get("tags") || "");
  useEffect(() => {
    setTags(fromCSV(tagsText));
  }, [tagsText]);

  const resultsLabel =
    loading ? "Loading…" : `${items.length} result${items.length === 1 ? "" : "s"}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Search Production & Filming Locations</h1>

      <div className="grid md:grid-cols-[280px_1fr] gap-6">
        {/* Filters */}
        <aside className="border rounded p-3">
          <input
            className="w-full border rounded px-2 py-1 mb-3"
            placeholder="Keyword…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <div className="mb-2">
            <label className="text-sm">City</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="text-sm">Type</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Residential, Commercial, …"
            />
          </div>

          <div className="mb-2">
            <label className="text-sm">Style</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="Modern, Rustic, …"
            />
          </div>

          <div className="mb-3">
            <label className="text-sm">Tags (comma-separated)</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="pool, ranch, warehouse"
            />
          </div>

          <div className="flex gap-2">
            <button
              className="flex-1 bg-black text-white rounded py-2 disabled:opacity-60"
              onClick={() => runSearch(true)}
              disabled={loading}
            >
              {loading ? "Searching…" : "Apply Filters"}
            </button>
            <button
              className="px-3 py-2 border rounded"
              onClick={() => {
                setQ("");
                setCity("");
                setType("");
                setStyle("");
                setTags([]);
                setTagsText("");
                // Also clear URL immediately
                router.push(pathname, { scroll: false });
                runSearch(false);
              }}
            >
              Reset
            </button>
          </div>
        </aside>

        {/* Results */}
        <section>
          <div className="text-sm text-gray-600 mb-3">{resultsLabel}</div>

          {err ? (
            <div className="text-red-700 border border-red-200 bg-red-50 p-3 rounded">
              {err}
            </div>
          ) : null}

          {!loading && items.length === 0 && !err ? (
            <div className="text-gray-700 border rounded p-6">
              No results. Try clearing a filter or broadening your search.
            </div>
          ) : null}

          <div className="grid md:grid-cols-3 gap-4">
            {items.map((it) => {
              const hero =
                it.photos.find((p) => p.isPrimary)?.url || it.photos[0]?.url || "";
              return (
                <Link
                  href={`/locations/${it.slug}`}
                  key={it.id}
                  className="border rounded overflow-hidden block hover:shadow-sm"
                >
                  <div
                    className="h-40 bg-gray-100"
                    style={{
                      backgroundImage: `url(${hero})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="p-3">
                    <div className="font-medium">{it.title}</div>
                    <div className="text-sm text-gray-600">
                      {it.propertyType}
                      {it.city ? ` • ${it.city}` : ""}
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Simple loading skeletons */}
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <div key={`sk-${i}`} className="border rounded overflow-hidden">
                  <div className="h-40 bg-gray-100 animate-pulse" />
                  <div className="p-3">
                    <div className="h-4 w-2/3 bg-gray-100 rounded mb-2 animate-pulse" />
                    <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
