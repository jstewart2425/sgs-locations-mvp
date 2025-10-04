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

// Wrapper that satisfies Next's requirement for Suspense when using useSearchParams
export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-8">Loading search…</div>}>
      <SearchPage />
    </Suspense>
  );
}

function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // seed from URL
  const [q, setQ] = useState(sp.get("q") || "");
  const [city, setCity] = useState(sp.get("city") || "");
  const [type, setType] = useState(sp.get("type") || "");
  const [style, setStyle] = useState(sp.get("style") || "");
  const [tags, setTags] = useState<string[]>(fromCSV(sp.get("tags")));
  const [sort, setSort] = useState(sp.get("sort") || "recent"); // recent | alpha | city
  const [tagMode, setTagMode] = useState((sp.get("tagMode") || "OR").toUpperCase()); // OR | AND
  const [pageSize, setPageSize] = useState<number>(Number(sp.get("pageSize") || 12));
  const [page, setPage] = useState<number>(Math.max(1, Number(sp.get("page") || 1)));

  const [items, setItems] = useState<Loc[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(1);
  const [hasPrev, setHasPrev] = useState<boolean>(false);
  const [hasNext, setHasNext] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // tags text input control
  const [tagsText, setTagsText] = useState(sp.get("tags") || "");
  useEffect(() => {
    setTags(fromCSV(tagsText));
  }, [tagsText]);

  // Build query string from current filters
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (city) params.set("city", city);
    if (type) params.set("type", type);
    if (style) params.set("style", style);
    if (tags.length) params.set("tags", toCSV(tags));
    if (sort) params.set("sort", sort);
    if (tagMode) params.set("tagMode", tagMode);
    if (page > 1) params.set("page", String(page));
    if (pageSize !== 12) params.set("pageSize", String(pageSize));
    return params.toString();
  }, [q, city, type, style, tags, sort, tagMode, page, pageSize]);

  async function runSearch(pushUrl = true) {
    try {
      setLoading(true);
      setErr(null);
      if (pushUrl) {
        router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, { scroll: false });
      }
      const res = await fetch(`/api/search?${queryString}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Search failed (${res.status})`);
      const json = await res.json();

      setItems(json.items || []);
      setTotal(json.total || 0);
      setPage(json.page || 1);
      setPageCount(json.pageCount || 1);
      setHasPrev(!!json.hasPrevPage);
      setHasNext(!!json.hasNextPage);
    } catch (e: any) {
      setErr(e?.message || "Search failed");
      setItems([]);
      setTotal(0);
      setPageCount(1);
      setHasPrev(false);
      setHasNext(false);
    } finally {
      setLoading(false);
    }
  }

  // initial search (based on URL) on mount
  useEffect(() => {
    runSearch(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resultsLabel = loading
    ? "Loading…"
    : `${total} result${total === 1 ? "" : "s"} • Page ${page}/${pageCount}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Search Production & Filming Locations</h1>

      <div className="grid md:grid-cols-[280px_1fr] gap-6">
        {/* Filters */}
        <aside className="border rounded p-3 space-y-3">
          <input
            className="w-full border rounded px-2 py-1"
            placeholder="Keyword…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <div>
            <label className="text-sm">City</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Type</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Residential, Commercial, …"
            />
          </div>

          <div>
            <label className="text-sm">Style</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="Modern, Rustic, …"
            />
          </div>

          <div>
            <label className="text-sm">Tags (comma-separated)</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="pool, ranch, warehouse"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm">Sort</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="recent">Most recent</option>
                <option value="alpha">Alphabetical</option>
                <option value="city">City</option>
              </select>
            </div>
            <div>
              <label className="text-sm">Tag mode</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={tagMode}
                onChange={(e) => setTagMode(e.target.value.toUpperCase())}
              >
                <option value="OR">OR (any tag)</option>
                <option value="AND">AND (all tags)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm">Page size</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={36}>36</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div>
              <label className="text-sm">Page</label>
              <input
                className="w-full border rounded px-2 py-1"
                type="number"
                min={1}
                max={Math.max(1, pageCount)}
                value={page}
                onChange={(e) => setPage(Math.max(1, Number(e.target.value || 1)))}
              />
            </div>
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
                setSort("recent");
                setTagMode("OR");
                setPage(1);
                setPageSize(12);
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
          <div className="flex items-center justify-between mb-3 text-sm text-gray-700">
            <div>{resultsLabel}</div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 border rounded disabled:opacity-50"
                onClick={() => {
                  if (!hasPrev) return;
                  setPage((p) => Math.max(1, p - 1));
                  setTimeout(() => runSearch(true), 0);
                }}
                disabled={!hasPrev || loading}
              >
                ← Prev
              </button>
              <button
                className="px-3 py-1.5 border rounded disabled:opacity-50"
                onClick={() => {
                  if (!hasNext) return;
                  setPage((p) => p + 1);
                  setTimeout(() => runSearch(true), 0);
                }}
                disabled={!hasNext || loading}
              >
                Next →
              </button>
            </div>
          </div>

          {err ? (
            <div className="text-red-700 border border-red-200 bg-red-50 p-3 rounded mb-4">
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
              const hero = it.photos.find((p) => p.isPrimary)?.url || it.photos[0]?.url || "";
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
