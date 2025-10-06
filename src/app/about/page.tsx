import Link from "next/link";

export const metadata = {
  title: "About — SGS Locations",
  description: "Who we are and what we do for productions and property owners.",
};

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* Hero */}
      <section>
        <h1 className="text-3xl font-bold">About SGS Locations</h1>
        <p className="mt-3 text-gray-700 max-w-3xl">
          We operate the largest, production-ready location library in Dallas–Fort Worth,
          supporting film, TV, and commercial teams with fast scouting, permitting, and logistics.
        </p>
      </section>

      {/* Services */}
      <section className="grid md:grid-cols-3 gap-6">
        {[
          {
            t: "Location Library",
            d: "Curated listings with high-quality photography and production-useful details.",
          },
          {
            t: "Scouting & Permitting",
            d: "On-the-ground scouting and the right permits to keep your schedule on track.",
          },
          {
            t: "Owner Submissions",
            d: "Clear review and approval so properties go live quickly and safely.",
          },
        ].map((s) => (
          <div key={s.t} className="border rounded p-5 bg-white">
            <div className="font-medium mb-1">{s.t}</div>
            <p className="text-sm text-gray-700">{s.d}</p>
          </div>
        ))}
      </section>

      {/* Creds / Clients */}
      <section className="space-y-3">
        <div className="text-lg font-semibold">Trusted by industry leaders</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {["Landman", "Yellowstone", "Lioness", "Madison", "1883", "1882"].map((c) => (
            <div key={c} className="border rounded h-16 flex items-center justify-center bg-white">
              <span className="text-sm text-gray-700">{c}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border rounded p-6 bg-gray-50">
        <div className="font-medium mb-2">Ready to scout?</div>
        <div className="flex flex-wrap gap-3">
          <Link href="/search" className="px-4 py-2 bg-black text-white rounded">
            Start Your Search
          </Link>
          <Link href="/list-your-property" className="px-4 py-2 border rounded bg-white">
            List Your Property
          </Link>
        </div>
      </section>
    </div>
  );
}

