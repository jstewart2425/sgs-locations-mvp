"use client";

import { useState } from "react";

export default function InquiryForm({ locationId }: { locationId: string }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    try {
      setSubmitting(true);
      setErr(null);
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locationId,
          fullName,
          email,
          company: company || undefined,
          phone: phone || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          message: message || undefined,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `Request failed (${res.status})`);
      }
      setDone(true);
      setFullName("");
      setEmail("");
      setCompany("");
      setPhone("");
      setStartDate("");
      setEndDate("");
      setMessage("");
    } catch (e: any) {
      setErr(e?.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="border rounded p-4 bg-green-50 text-green-800">
        Thanks! We received your inquiry and will get back to you shortly.
      </div>
    );
  }

  return (
    <div className="border rounded p-4">
      <div className="font-medium mb-2">Request info / availability</div>

      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm">Full name *</label>
          <input className="w-full border rounded px-2 py-1"
            value={fullName} onChange={e=>setFullName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Email *</label>
          <input className="w-full border rounded px-2 py-1" type="email"
            value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Company</label>
          <input className="w-full border rounded px-2 py-1"
            value={company} onChange={e=>setCompany(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Phone</label>
          <input className="w-full border rounded px-2 py-1"
            value={phone} onChange={e=>setPhone(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Start date</label>
          <input className="w-full border rounded px-2 py-1" type="date"
            value={startDate} onChange={e=>setStartDate(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">End date</label>
          <input className="w-full border rounded px-2 py-1" type="date"
            value={endDate} onChange={e=>setEndDate(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm">Message</label>
          <textarea className="w-full border rounded px-2 py-1" rows={4}
            value={message} onChange={e=>setMessage(e.target.value)} />
        </div>
      </div>

      {err && <div className="text-red-700 bg-red-50 border border-red-200 rounded p-2 mt-3">{err}</div>}

      <div className="mt-3">
        <button
          className="px-4 py-2 bg-black text-white rounded disabled:opacity-60"
          onClick={submit}
          disabled={submitting || !fullName || !email}
        >
          {submitting ? "Sending..." : "Send Inquiry"}
        </button>
      </div>
    </div>
  );
}
