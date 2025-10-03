import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_: Request, { params }: { params: { slug: string }}) {
  const loc = await prisma.location.findUnique({
    where: { slug: params.slug },
    include: { photos: true, tags: true, inquiries: true },
  });
  if (!loc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(loc);
}
