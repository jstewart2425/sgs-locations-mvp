import Link from "next/link";
import { prisma } from "@/lib/db";
import ClientLogos from "@/components/ClientLogos";

// --- Simple helpers ---
function classNames(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

export const metadata = {
  title: "SGS Locations — Dallas–Fort Worth’s Largest Location Database",
  description:
    "Find, scout, and secure production-ready filming locations across DFW and beyond. Curated listings, high-quality photos, and fast approvals.",
};

export default async function HomePage() {
  // Featured = “recent approved” for now (12). You can add a `featured` boolean later.
  const featured = await prisma.location.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    take: 12,
    include: { photos: true, tags: true },
  });

  // “Categories” -> quick links (edit freely)
  const categories: { label: string; href: string; note?: string }[] = [
    { label: "Modern Homes", href: "/search?type=Residential&style=Modern" },
    { label: "Industrial", href: "/search?type=Commercial&q=warehouse" },
    { label: "Ranch / Land", href: "/search?q=ranch" },
    { label: "Historic", href: "/search?style=Historic" },
    { label: "Luxury Estates", href: "/search?q=estate" },
    { label: "Restaurants & Bars", href: "/search?type=Commercial&q=restaurant" },
  ];

  

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b">
        <div
          className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-center opacity-20"
          aria-hidden
        />
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-3xl">
            Dallas–Fort Worth’s largest, production-ready location library.
          </h1>
          <p className="mt-4 text-gray-700 max-w-2xl">
            Curated listings, high-quality photos, and fast approvals. Built for film, TV, and
            commercial productions on real timelines.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/search"
              className="px-5 py-2.5 rounded bg-black text-white hover:opacity-90"
            >
              Search Locations
            </Link>
            <Link
              href="/list-your-property"
              className="px-5 py-2.5 rounded border hover:bg-gray-50"
            >
              List Your Property
            </Link>
          </div>
          <div className="mt-6 text-sm text-gray-600">
            Questions? <a href="tel:15555555555" className="underline">(555) 555-5555</a> •{" "}
            <a href="mailto:info@sgslocations.com" className="underline">info@sgslocations.com</a>
          </div>
        </div>
      </section>

      {/* FEATURED LOCATIONS */}
      <section className="max-w-6xl mx-auto px-4 py-10 md:py-14">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-2xl font-semibold">Featured Locations</h2>
          <Link href="/search" className="text-sm underline">
            View all
          </Link>
        </div>

        {featured.length === 0 ? (
          <div className="border rounded p-6 text-gray-700">
            No locations yet. Approve a submission in{" "}
            <Link className="underline" href="/admin/submissions">
              Admin ▸ Submissions
            </Link>{" "}
            to see it featured here.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((loc: any) => {
              const hero =
                loc.photos.find((p: any) => p.isPrimary)?.url || loc.photos[0]?.url || "";
              return (
                <Link
                  key={loc.id}
                  href={`/locations/${loc.slug}`}
                  className="group border rounded overflow-hidden hover:shadow"
                >
                  <div
                    className="h-44 bg-gray-100"
                    style={{
                      backgroundImage: `url(${hero})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="p-3">
                    <div className="font-medium">{loc.title}</div>
                    <div className="text-sm text-gray-600">
                      {loc.propertyType}
                      {loc.city ? ` • ${loc.city}` : ""}
                    </div>
                    {loc.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {loc.tags.slice(0, 4).map((t: any) => (
                          <span
                            key={t.name}
                            className="text-xs px-2 py-0.5 border rounded bg-white"
                          >
                            {t.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* CATEGORIES */}
      <section className="bg-gray-50 border-y">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
          <h2 className="text-2xl font-semibold mb-4">Browse by Category</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="border rounded p-4 hover:bg-white hover:shadow"
              >
                <div className="font-medium">{c.label}</div>
                {c.note ? <div className="text-sm text-gray-600">{c.note}</div> : null}
              </Link>
            ))}
          </div>
        </div>
      </section>

     {/* CLIENT LOGOS / TRUST STRIP */}
<ClientLogos />


      {/* SERVICES */}
      <section className="bg-gray-50 border-y">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
          <h2 className="text-2xl font-semibold mb-6">What we do</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border rounded p-4 bg-white">
              <div className="font-medium mb-1">Location Library</div>
              <p className="text-sm text-gray-700">
                Curated, searchable locations with high-quality photos and production-useful details.
              </p>
            </div>
            <div className="border rounded p-4 bg-white">
              <div className="font-medium mb-1">Scouting & Permitting</div>
              <p className="text-sm text-gray-700">
                On-the-ground scouting, local permits, and logistics—done fast and done right.
              </p>
            </div>
            <div className="border rounded p-4 bg-white">
              <div className="font-medium mb-1">Owner Submissions</div>
              <p className="text-sm text-gray-700">
                Simple owner intake with review & approval so listings go live quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="max-w-6xl mx-auto px-4 py-10 md:py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { k: "20+ years", v: "experience" },
            { k: "65+", v: "locations live" },
            { k: "48h", v: "typical approval" },
            { k: "DFW", v: "primary coverage" },
          ].map((s) => (
            <div key={s.k} className="border rounded p-4 text-center bg-white">
              <div className="text-2xl font-bold">{s.k}</div>
              <div className="text-sm text-gray-700">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DUAL CTA */}
      <section className="bg-gray-50 border-t">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 grid md:grid-cols-2 gap-6">
          <div className="border rounded p-6 bg-white">
            <div className="text-lg font-semibold mb-2">For Productions</div>
            <p className="text-sm text-gray-700 mb-4">
              Search the library, shortlist favorites, and contact us to book. We’ll help scout and
              secure your dates.
            </p>
            <div className="flex gap-3">
              <Link href="/search" className="px-4 py-2 bg-black text-white rounded">
                Start Your Search
              </Link>
              <a href="tel:15555555555" className="px-4 py-2 border rounded">
                Call (555) 555-5555
              </a>
            </div>
          </div>
          <div className="border rounded p-6 bg-white">
            <div className="text-lg font-semibold mb-2">For Property Owners</div>
            <p className="text-sm text-gray-700 mb-4">
              Turn your property into production revenue. Submit photos and details—it’s free to
              list and quick to get approved.
            </p>
            <Link href="/list-your-property" className="px-4 py-2 bg-black text-white rounded">
              List Your Property
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
