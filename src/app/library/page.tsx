import Link from "next/link";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Location Library · SGS Locations",
  description: "Browse approved locations by tag and property type.",
};

export default async function LibraryPage() {
  // pull a few tags + recent approved locations (simple, safe defaults)
  const [tags, recent] = await Promise.all([
    prisma.tag.findMany({ orderBy: { name: "asc" }, take: 50 }),
    prisma.location.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      take: 12,
      include: { photos: true, tags: true },
    }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Location Library</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Browse by Tag</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((t: any) => (
            <Link
              key={t.id}
              href={`/search?tags=${encodeURIComponent(t.name)}`}
              className="px-3 py-1.5 border rounded hover:bg-gray-50 text-sm"
            >
              {t.name}
            </Link>
          ))}
          {tags.length === 0 && <div className="text-gray-600">No tags yet.</div>}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Recently Approved</h2>
        {recent.length === 0 ? (
          <div className="text-gray-600">No locations yet. Approve a submission to see it here.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recent.map((loc: any) => {
              const hero = loc.photos.find((p: any) => p.isPrimary)?.url || loc.photos[0]?.url || "";
              return (
                <Link
                  key={loc.id}
                  href={`/locations/${loc.slug}`}
                  className="border rounded overflow-hidden hover:shadow"
                >
                  <div
                    className="h-40 bg-gray-100 bg-cover bg-center"
                    style={{ backgroundImage: `url(${hero})` }}
                  />
                  <div className="p-3">
                    <div className="font-semibold">{loc.title}</div>
                    <div className="text-sm text-gray-600">
                      {loc.propertyType}{loc.city ? ` · ${loc.city}` : ""}{loc.region ? `, ${loc.region}` : ""}
                    </div>
                    {loc.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {loc.tags.slice(0, 4).map((t: any) => (
                          <span key={t.id} className="text-xs px-2 py-0.5 border rounded">
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
    </div>
  );
}

