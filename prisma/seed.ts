import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const demoLocations = [
    {
      title: "Modern Home in Dallas",
      slug: "modern-home-dallas",
      propertyType: "Residential",
      city: "Dallas",
      style: "Modern",
      approved: true,
      photos: {
        create: [{ url: "/locations/modern-home.jpg", isPrimary: true }],
      },
    },
    {
      title: "Rustic Ranch in Weatherford",
      slug: "rustic-ranch-weatherford",
      propertyType: "Ranch",
      city: "Weatherford",
      style: "Rustic",
      approved: true,
      photos: {
        create: [{ url: "/locations/ranch.jpg", isPrimary: true }],
      },
    },
    {
      title: "Industrial Warehouse in Fort Worth",
      slug: "industrial-warehouse-fort-worth",
      propertyType: "Commercial",
      city: "Fort Worth",
      style: "Industrial",
      approved: true,
      photos: {
        create: [{ url: "/locations/warehouse.jpg", isPrimary: true }],
      },
    },
    {
      title: "Historic Mansion in Downtown Fort Worth",
      slug: "historic-mansion-fort-worth",
      propertyType: "Residential",
      city: "Fort Worth",
      style: "Historic",
      approved: true,
      photos: {
        create: [{ url: "/locations/historic.jpg", isPrimary: true }],
      },
    },
    {
      title: "Luxury Estate in Southlake",
      slug: "luxury-estate-southlake",
      propertyType: "Residential",
      city: "Southlake",
      style: "Luxury",
      approved: true,
      photos: {
        create: [{ url: "/locations/estate.jpg", isPrimary: true }],
      },
    },
    {
      title: "Bar & Lounge in Fort Worth",
      slug: "bar-lounge-fort-worth",
      propertyType: "Commercial",
      city: "Fort Worth",
      style: "Contemporary",
      approved: true,
      photos: {
        create: [{ url: "/locations/bar.jpg", isPrimary: true }],
      },
    },
  ];

  for (const loc of demoLocations) {
    await prisma.location.upsert({
      where: { slug: loc.slug },
      update: {},
      create: loc,
    });
  }

  console.log("✅ Demo locations added");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

