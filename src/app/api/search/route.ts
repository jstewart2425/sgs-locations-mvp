export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Safety caps
const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 50;

type SortKey = "recent" | "alpha" | "city";
type TagMode = "OR" | "AND";

function csv(input?: string | null) {
  if (!input) return [];
  return input.split(",").map((s) => s.trim()).filter(Boolean);
}

function clampPageSize(n: number) {
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_PAGE_SIZE;
  return Math.min(n, MAX_PAGE_SIZE);
}

function parseSort(v?: string | null): SortKey {
  switch ((v || "").toLowerCase()) {
    case "alpha":
      return "alpha";
    case "city":
      return "city";
    default:
      return "recent";
  }
}

function parseTagMode(v?: string | null): TagMode {
  return ((v || "OR").toUpperCase() === "AND" ? "AND" : "OR") as TagMode;
}

function buildPageLink(reqUrl: string, page: number | null) {
  if (!page || page < 1) return null;
  const u = new URL(reqUrl);
  u.searchParams.set("page", String(page));
  return u.pathname + "?" + u.searchParams.toString();
}

export async function GET(req: NextRequest) {
  try {
    const url = req.nextUrl;
    const sp = url.searchParams;

    // --- Filters ---
    const q = (sp.get("q") || "").trim();
    const city = (sp.get("city") || "").trim();
    const type = (sp.get("type") || "").trim();
    const style = (sp.get("style") || "").trim(); // maps to features[] HAS <style>
    const tags = csv(sp.get("tags"));
    const tagMode = parseTagMode(sp.get("tagMode"));

    // --- Sorting ---
    const sort = parseSort(sp.get("sort"));
    const orderBy =
      sort === "alpha"
        ? [{ title: "asc" as const }]
        : sort === "city"
        ? [{ city: "asc" as const }, { title: "asc" as const }]
        : [{ createdAt: "desc" as const }]; // "recent"

    // --- Pagination ---
    const page = Math.max(1, Number(sp.get("page") || 1));
    const pageSize = clampPageSize(Number(sp.get("pageSize") || DEFAULT_PAGE_SIZE));
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // --- WHERE clause ---
    const where: any = { approved: true };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { region: { contains: q, mode: "insensitive" } },
      ];
    }
    if (city) where.city = { contains: city, mode: "insensitive" };
    if (type) where.propertyType = { contains: type, mode: "insensitive" };
    if (style) where.features = { has: style };

    if (tags.length) {
      if (tagMode === "AND") {
        // Every tag required: chain multiple "some" clauses in AND
        where.AND = [
          ...(where.AND || []),
          ...tags.map((t) => ({ tags: { some: { name: { equals: t } } } })),
        ];
      } else {
        // OR: at least one
        where.tags = { some: { name: { in: tags } } };
      }
    }

    // --- Query ---
    const [total, items] = await Promise.all([
      prisma.location.count({ where }),
      prisma.location.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          photos: {
            orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
            select: { url: true, isPrimary: true },
          },
          tags: { select: { name: true } },
        },
      }),
    ]);

    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    const hasPrevPage = page > 1;
    const hasNextPage = page < pageCount;

    // Build next/prev links that preserve current filters/sort
    const next = hasNextPage ? buildPageLink(req.url, page + 1) : null;
    const prev = hasPrevPage ? buildPageLink(req.url, page - 1) : null;

    return NextResponse.json({
      items,
      total,
      page,
      pageSize,
      pageCount,
      hasPrevPage,
      hasNextPage,
      prev, // e.g. "/api/search?city=...&page=1..."
      next, // e.g. "/api/search?city=...&page=3..."
      sort, // echo back
      tagMode, // echo back
    });
  } catch (err: any) {
    console.error("SEARCH API ERROR:", err);
    return NextResponse.json(
      { error: "Search failed", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}

