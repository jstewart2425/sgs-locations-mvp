import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q       = searchParams.get("q") || undefined;
  const tagsStr = searchParams.get("tags") || "";
  const tags    = tagsStr ? tagsStr.split(",").map(s => s.trim()) : [];
  const city    = searchParams.get("city") || undefined;
  const region  = searchParams.get("region") || undefined;
  const minRate = searchParams.get("minRate");
  const maxRate = searchParams.get("maxRate");
  const style   = searchParams.get("style") || undefined;
  const type    = searchParams.get("type") || undefined;

  const where: any = { approved: true };

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" }},
      { description: { contains: q, mode: "insensitive" }},
      { summary: { contains: q, mode: "insensitive" }},
    ];
  }
  if (tags.length) {
    where.tags = { some: { name: { in: tags } } };
  }
  if (city) where.city = { equals: city, mode: "insensitive" } as any;
  if (region) where.region = { equals: region, mode: "insensitive" } as any;
  if (style) where.style = { equals: style, mode: "insensitive" } as any;
  if (type) where.propertyType = { equals: type, mode: "insensitive" } as any;

  if (minRate || maxRate) {
    where.dailyRate = {};
    if (minRate) where.dailyRate.gte = Number(minRate);
    if (maxRate) where.dailyRate.lte = Number(maxRate);
  }

  const items = await prisma.location.findMany({
    where,
    include: { photos: true, tags: true },
    take: 48,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ items });
}
