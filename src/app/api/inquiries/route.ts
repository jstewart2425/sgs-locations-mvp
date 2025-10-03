import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  message: z.string().optional(),
  locationId: z.string().optional(),
});

export async function POST(req: Request) {
  const data = schema.parse(await req.json());
  const created = await prisma.inquiry.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      projectType: data.projectType,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      message: data.message,
      locationId: data.locationId || null,
    } as any,
  });
  return NextResponse.json({ ok: true, id: created.id });
}
