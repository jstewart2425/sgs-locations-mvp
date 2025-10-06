// src/components/ClientLogos.tsx
type Logo = { name: string; src: string };

const LOGOS: Logo[] = [
  { name: "Landman", src: "/clients/landman.png" },
  { name: "Yellowstone", src: "/clients/yellowstone.png" },
  { name: "Lioness", src: "/clients/lioness.png" },
  { name: "Madison", src: "/clients/madison.png" },
  { name: "1883", src: "/clients/1883.png" },
];

export default function ClientLogos() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10 md:py-14">
      <h2 className="text-2xl font-semibold mb-4">Trusted by industry leaders</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {LOGOS.map((l) => (
          <div
            key={l.name}
            className="flex items-center justify-center border rounded bg-white h-20 px-4 overflow-hidden"
            title={l.name}
            aria-label={l.name}
          >
            <img
              src={l.src}
              alt={l.name}
              className="max-h-14 w-auto object-contain block"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
