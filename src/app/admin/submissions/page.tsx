import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const adminEmail = process.env.ADMIN_EMAIL || "";
  if (!session?.user?.email || session.user.email.toLowerCase() !== adminEmail.toLowerCase()) {
    redirect("/login");
  }
  return session.user;
}

export default async function AdminSubmissionsPage() {
  await requireAdmin();

  const subs = await prisma.propertySubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Admin · Property Submissions</h1>

      <table className="w-full text-sm border">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left">When</th>
            <th className="p-2 text-left">Owner</th>
            <th className="p-2 text-left">Property</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Photos</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subs.map((s: any) => (
            <tr key={s.id} className="border-t align-top">
              <td className="p-2">{new Date(s.createdAt).toLocaleString()}</td>
              <td className="p-2">
                <div className="font-medium">{s.ownerName}</div>
                <div className="text-gray-600">{s.ownerEmail}{s.ownerPhone ? ` · ${s.ownerPhone}` : ""}</div>
              </td>
              <td className="p-2">
                <div className="font-medium">{s.propertyName}</div>
                <div className="text-gray-600">{s.propertyType} · {s.city}, {s.state}</div>
                {s.description && <div className="text-gray-700 mt-1">{s.description}</div>}
                {s.features?.length ? (
                  <div className="mt-1">
                    <b>Features:</b> {s.features.join(", ")}
                  </div>
                ) : null}
              </td>
              <td className="p-2">{s.status}</td>
              <td className="p-2">
                <div className="grid grid-cols-3 gap-1 max-w-[240px]">
                  {s.photoUrls?.slice(0, 9).map((u: any) => (
                    <img key={u} src={u} className="w-20 h-14 object-cover border rounded" />
                  ))}
                </div>
              </td>
              <td className="p-2">
                <ApproveButton submissionId={s.id} />
                <RejectButton submissionId={s.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ApproveButton({ submissionId }: { submissionId: string }) {
  async function approve() {
    "use server";
    const adminEmail = process.env.ADMIN_EMAIL || "";
    // simple guard server-side too
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || session.user.email.toLowerCase() !== adminEmail.toLowerCase()) return;

    const sub = await prisma.propertySubmission.findUnique({ where: { id: submissionId } });
    if (!sub) return;

    // Create/ensure tags from features
    const featureTags = (sub.features || []).filter(Boolean);
    const tagRecords = await Promise.all(
      featureTags.map((name: any) =>
        prisma.tag.upsert({ where: { name }, update: {}, create: { name } })
      )
    );

    // Basic slug from property name + city
    const base = `${sub.propertyName}-${sub.city || ""}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    let slug = base || `location-${sub.id.slice(0, 6)}`;
    // ensure unique slug
    let i = 1;
    while (await prisma.location.findUnique({ where: { slug } })) {
      slug = `${base}-${i++}`;
    }

    // Create Location
    const loc = await prisma.location.create({
      data: {
        title: sub.propertyName,
        slug,
        summary: sub.description?.slice(0, 180) || null,
        description: sub.description || null,
        propertyType: sub.propertyType || "Unknown",
        city: sub.city || null,
        region: sub.state || null,
        features: featureTags,
        approved: true,
        tags: { connect: tagRecords.map((t) => ({ id: t.id })) },
        photos: {
          create: (sub.photoUrls || []).map((url: any, idx: any) => ({
            url,
            isPrimary: idx === 0,
          })),
        },
      },
    });

    // Mark submission approved
    await prisma.propertySubmission.update({
      where: { id: submissionId },
      data: { status: "APPROVED" },
    });

    // Redirect to new Location (optional)
    // redirect(`/locations/${loc.slug}`);
  }

  return (
    <form action={approve}>
      <button className="px-3 py-1 bg-green-600 text-white rounded mr-2" type="submit">
        Approve → Create Location
      </button>
    </form>
  );
}

function RejectButton({ submissionId }: { submissionId: string }) {
  async function reject() {
    "use server";
    const adminEmail = process.env.ADMIN_EMAIL || "";
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || session.user.email.toLowerCase() !== adminEmail.toLowerCase()) return;

    await prisma.propertySubmission.update({
      where: { id: submissionId },
      data: { status: "REJECTED" },
    });
  }

  return (
    <form action={reject}>
      <button className="px-3 py-1 bg-red-600 text-white rounded" type="submit">
        Reject
      </button>
    </form>
  );
}
