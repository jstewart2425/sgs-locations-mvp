import Link from "next/link";

export default function LibraryPage() {
  const categories = ["Residential", "Commercial", "Industrial", "Ranch", "Historic", "Modern"];
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Location Library</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {categories.map(c => (
          <Link key={c} href={`/search?type=${encodeURIComponent(c)}`} className="border rounded p-6 hover:bg-gray-50">
            <div className="font-semibold">{c}</div>
            <div className="text-sm text-gray-600">Browse {c} locations</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
