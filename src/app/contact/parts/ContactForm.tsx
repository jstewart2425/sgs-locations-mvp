"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    try {
      setSubmitting(true);
      setErr(null);
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company: company || undefined,
          phone: phone || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          message: message || undefined,
          // no locationId here (general inquiry)
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `Request failed (${res.status})`);
      }
      setOk(true);
      setName(""); setEmail(""); setCompany(""); setPhone(""); setStartDate(""); setEndDate(""); setMessage("");
    } catch (e: any) {
      setErr(e?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (ok) {
    return (
      <div className="border rounded p-4 bg-green-50 text-green-800">
        Thanks! We received your message and will respond shortly.
      </div>
    );
  }

  return (
    <div className="border rounded p-4 bg-white">
      <div className="font-medium mb-2">Send us a message</div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm">Name *</label>
          <input className="w-full border rounded px-2 py-1" value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Email *</label>
          <input className="w-full border rounded px-2 py-1" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Company</label>
          <input className="w-full border rounded px-2 py-1" value={company} onChange={e=>setCompany(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Phone</label>
          <input className="w-full border rounded px-2 py-1" value={phone} onChange={e=>setPhone(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Start date</label>
          <input className="w-full border rounded px-2 py-1" type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">End date</label>
          <input className="w-full border rounded px-2 py-1" type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm">Message</label>
          <textarea className="w-full border rounded px-2 py-1" rows={4} value={message} onChange={e=>setMessage(e.target.value)} />
        </div>
      </div>

      {err && <div className="text-red-700 bg-red-50 border border-red-200 rounded p-2 mt-3">{err}</div>}

      <div className="mt-3">
        <button
          className="px-4 py-2 bg-black text-white rounded disabled:opacity-60"
          onClick={submit}
          disabled={submitting || !name || !email}
        >
          {submitting ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
}
