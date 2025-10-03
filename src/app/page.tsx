import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="relative h-[60vh] bg-[url('/hero.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-4xl mx-auto h-full flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Dallas Ft. Worth’s largest location database</h1>
          <div className="flex gap-3">
            <Link className="bg-white text-black px-4 py-2 rounded" href="/search">Search Locations</Link>
            <Link className="border px-4 py-2 rounded" href="/list-your-property">List Your Property</Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold mb-4">Featured Locations</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="border rounded overflow-hidden">
              <div className="h-40 bg-gray-100" />
              <div className="p-3">
                <div className="font-medium">Location {i}</div>
                <div className="text-sm text-gray-600">Modern Home • Fort Worth</div>
                <Link className="text-blue-600 text-sm" href={`/locations/modern-estate-fort-worth`}>View Details</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
