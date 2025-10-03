"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name })
    });
    const data = await res.json();
    if (data.ok) setMsg("Registered. You can log in now.");
    else setMsg(data.error || "Error");
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">Create an account</h1>
      <form onSubmit={submit} className="grid gap-3">
        <input className="border rounded px-2 py-2" placeholder="Name (optional)" value={name} onChange={e=>setName(e.target.value)} />
        <input className="border rounded px-2 py-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border rounded px-2 py-2" placeholder="Password (min 8 chars)" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="bg-black text-white rounded px-4 py-2" type="submit">Register</button>
        {msg && <div>{msg}</div>}
      </form>
    </div>
  );
}
