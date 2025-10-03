import { prisma } from "@/lib/db";

export default async function LocationPage({
  params,
}: {
  params: { slug: string };
}) {
  const loc = await prisma.location.findUnique({
    where: { slug: params.slug },
    include: { photos: true, tags: true },
  });

  if (!loc) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        Not found.
      </div>
    );
  }

  const hero =
    loc.photos.find((p: any) => p.isPrimary)?.url ??
    loc.photos[0]?.url ??
    "";

  return (
    <div>
      <div
        className="h-[50vh] bg-gray-100 bg-cover bg-center"
        style={{ backgroundImage: `url(${hero})` }}
      />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">
          {loc.title}{" "}
          <span className="text-sm align-middle px-2 py-1 border rounded">
            {loc.propertyType}
          </span>
        </h1>
        <div className="text-gray-600 mb-4">
          {loc.city}
          {loc.region ? ` • ${loc.region}` : ""}
        </div>
        <p className="mb-4">{loc.description}</p>

        <h2 className="text-xl font-semibold mb-2">Key Details</h2>
        <div className="grid md:grid-cols-3 gap-3 text-sm">
          {loc.style && (
            <div>
              <b>Style:</b> {loc.style}
            </div>
          )}
          {typeof loc.squareFeet === "number" && (
            <div>
              <b>Square Feet:</b> {loc.squareFeet}
            </div>
          )}
          {typeof loc.parkingSpaces === "number" && (
            <div>
              <b>Parking:</b> {loc.parkingSpaces}
            </div>
          )}
          {loc.features?.length ? (
            <div className="md:col-span-3">
              <b>Features:</b> {loc.features.join(", ")}
            </div>
          ) : null}
        </div>

        <h2 className="text-xl font-semibold mt-8 mb-2">Contact / Inquiry</h2>
        <InquiryForm locationId={loc.id} />
      </div>
    </div>
  );
}

function InquiryForm({ locationId }: { locationId: string }) {
  async function handleSubmit(formData: FormData) {
    "use server";
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      message: String(formData.get("message") || ""),
      locationId,
    };
    await fetch(`/api/inquiries`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
  }

  return (
    <form action={handleSubmit} className="grid md:grid-cols-2 gap-3">
      <input
        name="name"
        placeholder="Your Name"
        className="border rounded px-2 py-2"
        required
      />
      <input
        name="email"
        placeholder="Email"
        className="border rounded px-2 py-2"
        type="email"
        required
      />
      <input
        name="phone"
        placeholder="Phone"
        className="border rounded px-2 py-2 md:col-span-2"
      />
      <textarea
        name="message"
        placeholder="Message / details"
        className="border rounded px-2 py-2 md:col-span-2"
        rows={4}
      />
      <button
        className="bg-black text-white rounded px-4 py-2 md:col-span-2"
        type="submit"
      >
        Send Inquiry
      </button>
    </form>
  );
}
