import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const modern = await prisma.tag.upsert({ where: { name: "Modern" }, update: {}, create: { name: "Modern" }});
  const pool   = await prisma.tag.upsert({ where: { name: "Pool" }, update: {}, create: { name: "Pool" }});

  const loc = await prisma.location.upsert({
    where: { slug: "modern-estate-fort-worth" },
    update: {},
    create: {
      title: "Modern Estate",
      slug: "modern-estate-fort-worth",
      summary: "Open floor plan with natural light and pool.",
      description: "Beautiful modern home ideal for commercials and photo shoots.",
      propertyType: "Residential",
      city: "Fort Worth",
      style: "Modern",
      features: ["Pool","Natural Light"],
      approved: true,
      tags: { connect: [{ id: modern.id }, { id: pool.id }] },
      photos: { create: [{ url: "https://placehold.co/1200x800", isPrimary: true }] }
    }
  });
  console.log({ loc });
}

main().finally(()=>prisma.$disconnect());
