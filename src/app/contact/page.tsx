"use client";
import { useState } from "react";

export default function ContactPage() {
  const [ok, setOk] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setOk(res.ok);
    if (res.ok) (e.target as HTMLFormElement).reset();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Contact</h1>
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-3">
        <input name="name" placeholder="Your Name" className="border rounded px-2 py-2" required />
        <input name="email" placeholder="Email" className="border rounded px-2 py-2" type="email" required />
        <input name="phone" placeholder="Phone" className="border rounded px-2 py-2 md:col-span-2" />
        <input name="company" placeholder="Company" className="border rounded px-2 py-2 md:col-span-2" />
        <textarea name="message" placeholder="Message" className="border rounded px-2 py-2 md:col-span-2" rows={4} />
        <button className="bg-black text-white rounded px-4 py-2 md:col-span-2" type="submit">Send</button>
        {ok && <div className="text-green-700 md:col-span-2">Thanks — we’ll be in touch.</div>}
      </form>
    </div>
  );
}
