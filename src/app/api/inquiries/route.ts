import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Make sure this API route is always dynamic (no prerendering)
export const dynamic = "force-dynamic";
export const revalidate = 0;

const schema = z.object({
  // accept either "name" or "fullName" – we'll normalize below
  name: z.string().min(1, "Name is required").optional(),
  fullName: z.string().min(1, "Name is required").optional(),

  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.string().optional(),
  startDate: z.string().optional(), // ISO "yyyy-mm-dd"
  endDate: z.string().optional(),   // ISO "yyyy-mm-dd"
  message: z.string().optional(),
  locationId: z.string().optional(), // can be omitted for general inquiries
});

function parseDate(d?: string) {
  if (!d) return null;
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

export async function POST(req: Request) {
  try {
    const raw = await req.json();

    // validate shape first
    const parsed = schema.parse(raw);

    // normalize name: prefer explicit "name", fall back to "fullName"
    const name = (parsed.name ?? parsed.fullName ?? "").trim();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // If a locationId is provided, ensure it exists & (optionally) is approved
    let locationId: string | null = parsed.locationId ?? null;
    if (locationId) {
      const loc = await prisma.location.findUnique({
        where: { id: locationId },
        select: { id: true, approved: true },
      });
      if (!loc) {
        return NextResponse.json({ error: "Location not found" }, { status: 404 });
      }
      // If you want to restrict inquiries to approved listings only, uncomment:
      // if (!loc.approved) {
      //   return NextResponse.json({ error: "Location not approved" }, { status: 400 });
      // }
    }

    const created = await prisma.inquiry.create({
      data: {
        name,
        email: parsed.email.trim(),
        phone: parsed.phone?.trim() || null,
        company: parsed.company?.trim() || null,
        projectType: parsed.projectType?.trim() || null,
        startDate: parseDate(parsed.startDate),
        endDate: parseDate(parsed.endDate),
        message: parsed.message?.trim() || null,
        locationId,
        // status defaults to "new" via Prisma schema
      },
    });

    // TODO: send yourself an email/Slack notification here if you want.

    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (err: any) {
    // Zod validation errors
    if (err?.issues) {
      const first = err.issues[0];
      return NextResponse.json(
        { error: first?.message || "Invalid request" },
        { status: 400 }
      );
    }
    console.error("INQUIRY API ERROR:", err);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}

