import Image from "next/image";

type Logo = { name: string; src: string; width?: number; height?: number };

const LOGOS: Logo[] = [
  { name: "Landman", src: "/clients/landman.png", width: 160, height: 60 },
  { name: "Yellowstone", src: "/clients/yellowstone.png", width: 160, height: 60 },
  { name: "Lioness", src: "/clients/lioness.png", width: 140, height: 60 },
  { name: "Madison", src: "/clients/madison.png", width: 140, height: 60 },
  { name: "1883", src: "/clients/1883.png", width: 120, height: 60 },
];

export default function ClientLogos() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10 md:py-14">
      <h2 className="text-2xl font-semibold mb-4">Trusted by industry leaders</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {LOGOS.map((l) => (
          <div key={l.name} className="flex items-center justify-center border rounded bg-white h-16">
            <Image
              src={l.src}
              alt={l.name}
              width={l.width ?? 140}
              height={l.height ?? 60}
              style={{ height: "auto", width: "auto", maxWidth: "80%" }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

