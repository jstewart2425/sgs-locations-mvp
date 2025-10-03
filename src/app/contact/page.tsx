export const metadata = {
  title: "Contact · SGS Locations",
  description: "Get in touch with SGS Locations.",
};

export default function ContactPage() {
  async function submit(formData: FormData) {
    "use server";
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      message: String(formData.get("message") || ""),
    };
    // For now, just log/save later. You can wire this to /api/inquiries or email service.
    console.log("Contact submission", payload);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Contact</h1>
      <form action={submit} className="grid gap-3">
        <input name="name" placeholder="Your Name" className="border rounded px-3 py-2" required />
        <input name="email" placeholder="Email" type="email" className="border rounded px-3 py-2" required />
        <input name="phone" placeholder="Phone" className="border rounded px-3 py-2" />
        <textarea name="message" placeholder="How can we help?" rows={5} className="border rounded px-3 py-2" />
        <button className="bg-black text-white rounded px-4 py-2 w-fit">Send</button>
      </form>

      <div className="mt-8 text-sm text-gray-700">
        <div className="font-semibold">Office</div>
        <div>Fort Worth, TX</div>
        <div>
          <a href="tel:15555555555" className="underline">(555) 555-5555</a>{" "}
          • <a href="mailto:info@sgslocations.com" className="underline">info@sgslocations.com</a>
        </div>
      </div>
    </div>
  );
}
