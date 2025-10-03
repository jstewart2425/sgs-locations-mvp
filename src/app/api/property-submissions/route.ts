import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const payloadSchema = z.object({
  ownerName: z.string().min(1),
  ownerEmail: z.string().email(),
  ownerPhone: z.string().optional(),
  propertyName: z.string().min(1),
  propertyType: z.string().min(1),
  address1: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(2),
  zip: z.string().min(3),
  description: z.string().optional(),
  features: z.array(z.string()).default([]),
  photoUrls: z.array(z.string()).default([]),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = payloadSchema.parse(json);
    await prisma.propertySubmission.create({ data });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
