import ContactForm from "./parts/ContactForm";

export const metadata = {
  title: "Contact — SGS Locations",
  description: "Get in touch for scouting, bookings, and general inquiries.",
};

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-2xl font-semibold">Contact</h1>

      {/* Info cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="border rounded p-4 bg-white">
          <div className="font-medium mb-1">Office</div>
          <div className="text-sm text-gray-700">Fort Worth, TX</div>
          <div className="mt-2">
            <iframe
              title="Map"
              className="w-full h-40 rounded border"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=Fort+Worth,+TX&z=11&output=embed"
            />
          </div>
        </div>
        <div className="border rounded p-4 bg-white">
          <div className="font-medium mb-1">Talk to us</div>
          <div className="text-sm">
            <a className="underline" href="tel:15555555555">(555) 555-5555</a><br />
            <a className="underline" href="mailto:info@sgslocations.com">info@sgslocations.com</a>
          </div>
          <div className="mt-3 text-xs text-gray-600">Mon–Fri, 9am–6pm CT</div>
        </div>
        <div className="border rounded p-4 bg-white">
          <div className="font-medium mb-1">Permit help</div>
          <p className="text-sm text-gray-700">
            Need support navigating DFW permits? We can help fast. Reach out with your dates and scope.
          </p>
        </div>
      </div>

      {/* Form */}
      <ContactForm />
    </div>
  );
}
