export const metadata = {
  title: "About · SGS Locations",
  description: "About SGS Locations—Dallas–Fort Worth’s largest location database.",
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">About SGS Locations</h1>
      <p className="mb-4">
        We help productions find, scout, and secure locations across Dallas–Fort Worth and beyond.
        Our library includes homes, estates, offices, warehouses, ranches, restaurants, and more—
        with high-quality photos and searchable tags for fast, no-nonsense discovery.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">What we do</h2>
      <ul className="list-disc ml-6 space-y-1">
        <li>Curated, searchable location library</li>
        <li>Owner submissions & compliance review</li>
        <li>Fast admin approval to go live</li>
      </ul>
    </div>
  );
}

