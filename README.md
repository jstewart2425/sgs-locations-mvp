# SGS Locations MVP Starter

Stack: Next.js 14 (App Router) · Tailwind · Prisma · Vercel Postgres · UploadThing · NextAuth (Credentials)

## Quickstart

1. Copy `.env.example` to `.env` and fill values (Vercel Postgres + UploadThing + NEXTAUTH_SECRET).
2. Install deps: `npm install`
3. Initialize Prisma: `npm run prisma:migrate`
4. (Optional) Seed: `npm run seed`
5. Dev: `npm run dev` → http://localhost:3000

Deploy with Vercel; add the same env vars in the Vercel Project settings.
