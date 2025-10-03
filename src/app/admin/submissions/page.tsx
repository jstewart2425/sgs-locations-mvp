"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { useRouter } from "next/navigation";

type Submission = {
  id: string;
  name: string;
  description: string;
  address: string;
  photoUrls: string[];
  tags: string[];
  status: string;
};

export default function SubmissionsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    async function loadSubs() {
      const res = await fetch("/api/submissions");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    }
    loadSubs();
  }, []);

  if (!session) {
    return <div className="p-6">You must be logged in.</div>;
  }

  if (session.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return <div className="p-6">You are not authorized to view this page.</div>;
  }

  async function handleApprove(id: string) {
    await fetch(`/api/submissions/${id}/approve`, { method: "POST" });
    router.refresh();
  }

  async function handleReject(id: string) {
    await fetch(`/api/submissions/${id}/reject`, { method: "POST" });
    router.refresh();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Pending Submissions</h1>
      {submissions.length === 0 ? (
        <div>No submissions yet.</div>
      ) : (
        <div className="grid gap-6">
          {submissions.map((s) => (
            <div key={s.id} className="border rounded-lg p-4 shadow">
              <h2 className="text-lg font-semibold">{s.name}</h2>
              <p>{s.description}</p>
              <p className="text-sm text-gray-500">{s.address}</p>
              <div className="flex gap-2 my-2">
                {s.photoUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="photo"
                    className="w-20 h-20 object-cover rounded"
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(s.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(s.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

