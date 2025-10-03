"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", { redirect: false, email, password });
    if (res?.error) setErr(res.error);
    else window.location.href = "/";
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={submit} className="grid gap-3">
        <input className="border rounded px-2 py-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border rounded px-2 py-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="bg-black text-white rounded px-4 py-2" type="submit">Login</button>
        {err && <div className="text-red-600">{err}</div>}
      </form>
    </div>
  );
}
