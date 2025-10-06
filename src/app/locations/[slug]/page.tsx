import { prisma } from "@/lib/db";
import Link from "next/link";
import Gallery from "@/components/Gallery";
import InquiryForm from "@/components/InquiryForm";

type PageProps = { params: { slug: string } };

export const revalidate = 0; // always fresh

export default async function LocationDetail({ params }: PageProps) {
  const loc = await prisma.location.findUnique({
    where: { slug: params.slug },
    include: {
      photos: { orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }] },
      tags: true,
    },
  });

  if (!loc || !loc.approved) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        Not found.
      </div>
    );
  }

  // Similar locations: share any tag
  const tagNames = loc.tags.map((t: any) => t.name);
  const similar = tagNames.length
    ? await prisma.location.findMany({
        where: {
          approved: true,
          id: { not: loc.id },
          tags: { some: { name: { in: tagNames } } },
        },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { photos: true },
      })
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* TITLE + BASIC INFO */}
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{loc.title}</h1>
          <div className="text-sm text-gray-600">
            {loc.propertyType}{loc.city ? ` • ${loc.city}` : ""}{loc.region ? ` • ${loc.region}` : ""}
          </div>
        </div>
        <Link href="/search" className="text-sm underline">← Back to results</Link>
      </div>

      {/* GALLERY */}
      <Gallery photos={loc.photos} />

      {/* KEY DETAILS + INQUIRY */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {/* Key Details */}
          <div className="border rounded p-4">
            <div className="font-medium mb-2">Details</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <Detail label="Type" value={loc.propertyType} />
              <Detail label="City" value={loc.city} />
              <Detail label="Region" value={loc.region} />
              <Detail label="Style" value={loc.features?.join(", ")} />
            </div>
          </div>

          {/* Description */}
          {loc.description && (
            <div className="border rounded p-4 whitespace-pre-wrap">
              {loc.description}
            </div>
          )}

          {/* Tags */}
          {loc.tags.length > 0 && (
            <div className="border rounded p-4">
              <div className="font-medium mb-2">Tags</div>
              <div className="flex flex-wrap gap-2">
                {loc.tags.map((t: any) => (
                  <Link
                    key={t.name}
                    href={`/search?tags=${encodeURIComponent(t.name)}`}
                    className="text-xs px-2 py-1 border rounded"
                  >
                    {t.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Inquiry sidebar */}
        <div>
          <InquiryForm locationId={loc.id} />
        </div>
      </div>

      {/* Similar */}
      {similar.length > 0 && (
        <div className="space-y-3">
          <div className="text-lg font-semibold">Similar locations</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {similar.map((s: any) => {
              const hero = s.photos.find((p: any) => p.isPrimary)?.url || s.photos[0]?.url || "";
              return (
                <Link key={s.id} href={`/locations/${s.slug}`} className="border rounded overflow-hidden hover:shadow">
                  <div
                    className="h-40 bg-gray-100"
                    style={{ backgroundImage: `url(${hero})`, backgroundSize: "cover", backgroundPosition: "center" }}
                  />
                  <div className="p-3">
                    <div className="font-medium">{s.title}</div>
                    <div className="text-sm text-gray-600">{s.propertyType}{s.city ? ` • ${s.city}` : ""}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-gray-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
