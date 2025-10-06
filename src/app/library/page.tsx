import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Location Library — SGS Locations",
  description: "Browse filming locations by category.",
};

const CATEGORIES: { label: string; href: string; hint?: string }[] = [
  { label: "Modern Homes", href: "/search?type=Residential&style=Modern" },
  { label: "Luxury Estates", href: "/search?q=estate" },
  { label: "Historic", href: "/search?style=Historic" },
  { label: "Industrial / Warehouses", href: "/search?type=Commercial&q=warehouse" },
  { label: "Ranch / Land", href: "/search?q=ranch" },
  { label: "Restaurants & Bars", href: "/search?type=Commercial&q=restaurant" },
];

export default async function LibraryPage() {
  // Optional, quick counts by naive text filters (good enough for MVP).
  // If a count fails, we’ll just show "—".
  const counts = await Promise.all(
    CATEGORIES.map(async (c) => {
      try {
        // crude heuristic: look in title/description/tags for the key term(s)
        const term = decodeURIComponent(c.href.split("q=").pop() || "")
          .replace(/&.*/,"")
          .trim();
        const count = await prisma.location.count({
          where: {
            approved: true,
            OR: [
              term ? { title: { contains: term, mode: "insensitive" } } : undefined,
              term ? { description: { contains: term, mode: "insensitive" } } : undefined,
            ].filter(Boolean) as any,
          },
        });
        return count;
      } catch {
        return undefined;
      }
    })
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-2">Location Library</h1>
      <p className="text-gray-700 mb-6">
        Explore popular categories. Click a tile to jump into pre-filtered search results.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((c, i) => (
          <Link
            key={c.label}
            href={c.href}
            className="border rounded p-5 hover:shadow bg-white"
          >
            <div className="flex items-baseline justify-between">
              <div className="font-medium">{c.label}</div>
              <div className="text-sm text-gray-500">
                {typeof counts[i] === "number" ? `${counts[i]}+` : "—"}
              </div>
            </div>
            {c.hint && <div className="text-sm text-gray-600 mt-1">{c.hint}</div>}
          </Link>
        ))}
      </div>
    </div>
  );
}

